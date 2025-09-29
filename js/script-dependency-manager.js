/**
 * SCRIPT DEPENDENCY MANAGER
 * Resolves script loading race conditions by ensuring proper dependency order
 * and providing utilities for safe script initialization
 */

(function() {
    'use strict';

    console.log('🔧 [Script Dependency Manager] Initializing...');

    // Global dependency manager
    window.ScriptDependencyManager = {
        // Track loaded scripts and their readiness
        loadedScripts: new Set(),
        readyCallbacks: new Map(),
        maxWaitTime: 10000, // 10 seconds max wait

        /**
         * Mark a script as loaded and ready
         * @param {string} scriptName - Name of the script
         * @param {object} api - API object the script provides (optional)
         */
        markReady(scriptName, api = null) {
            console.log(`✅ [Script Dependency Manager] ${scriptName} is ready`);
            this.loadedScripts.add(scriptName);

            // Store API reference if provided
            if (api) {
                window[`${scriptName}API`] = api;
            }

            // Execute waiting callbacks
            if (this.readyCallbacks.has(scriptName)) {
                const callbacks = this.readyCallbacks.get(scriptName);
                callbacks.forEach(callback => {
                    try {
                        callback(api);
                    } catch (error) {
                        console.error(`❌ [Script Dependency Manager] Error in ${scriptName} callback:`, error);
                    }
                });
                this.readyCallbacks.delete(scriptName);
            }
        },

        /**
         * Wait for a script to be ready before executing callback
         * @param {string} scriptName - Name of the script to wait for
         * @param {function} callback - Function to execute when ready
         * @param {number} timeout - Optional timeout in milliseconds
         */
        waitFor(scriptName, callback, timeout = this.maxWaitTime) {
            if (this.loadedScripts.has(scriptName)) {
                // Script already ready, execute immediately
                const api = window[`${scriptName}API`] || null;
                callback(api);
                return Promise.resolve(api);
            }

            return new Promise((resolve, reject) => {
                // Add to waiting callbacks
                if (!this.readyCallbacks.has(scriptName)) {
                    this.readyCallbacks.set(scriptName, []);
                }

                const wrappedCallback = (api) => {
                    callback(api);
                    resolve(api);
                };

                this.readyCallbacks.get(scriptName).push(wrappedCallback);

                // Set timeout
                setTimeout(() => {
                    // Remove from callbacks if still waiting
                    if (this.readyCallbacks.has(scriptName)) {
                        const callbacks = this.readyCallbacks.get(scriptName);
                        const index = callbacks.indexOf(wrappedCallback);
                        if (index > -1) {
                            callbacks.splice(index, 1);
                            reject(new Error(`Timeout waiting for ${scriptName} after ${timeout}ms`));
                        }
                    }
                }, timeout);
            });
        },

        /**
         * Wait for multiple scripts to be ready
         * @param {string[]} scriptNames - Array of script names
         * @param {function} callback - Function to execute when all are ready
         * @param {number} timeout - Optional timeout in milliseconds
         */
        waitForAll(scriptNames, callback, timeout = this.maxWaitTime) {
            const promises = scriptNames.map(name => this.waitFor(name, () => {}, timeout));

            return Promise.all(promises).then(apis => {
                callback(apis);
                return apis;
            });
        },

        /**
         * Check if a script is ready
         * @param {string} scriptName - Name of the script
         * @returns {boolean}
         */
        isReady(scriptName) {
            return this.loadedScripts.has(scriptName);
        },

        /**
         * Get loading status report
         * @returns {object}
         */
        getStatus() {
            return {
                loadedScripts: Array.from(this.loadedScripts),
                waitingCallbacks: Array.from(this.readyCallbacks.keys()),
                totalLoaded: this.loadedScripts.size,
                totalWaiting: this.readyCallbacks.size
            };
        }
    };

    // Common dependency patterns
    window.ScriptDependencyManager.patterns = {
        /**
         * Wait for language manager to be ready
         * @param {function} callback - Function to execute when ready
         */
        waitForLanguageManager(callback) {
            return this.waitFor('unified-language-manager', callback);
        },

        /**
         * Wait for course card component to be ready
         * @param {function} callback - Function to execute when ready
         */
        waitForCourseCard(callback) {
            return this.waitFor('course-card-component', callback);
        },

        /**
         * Wait for teacher card component to be ready
         * @param {function} callback - Function to execute when ready
         */
        waitForTeacherCard(callback) {
            return this.waitFor('teacher-card', callback);
        }
    };

    // Auto-detect and mark DOM content as ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.ScriptDependencyManager.markReady('DOM');
        });
    } else {
        window.ScriptDependencyManager.markReady('DOM');
    }

    console.log('✅ [Script Dependency Manager] Ready');
    window.ScriptDependencyManager.markReady('script-dependency-manager');

})();