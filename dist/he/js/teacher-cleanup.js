/**
 * Teacher Card Cleanup Script
 * Removes any legacy teacher card implementations to prevent conflicts
 */

(function() {
    'use strict';

    console.log('🧹 [TeacherCleanup] Cleaning up legacy teacher implementations...');

    // Remove any global functions that might conflict
    if (typeof window.generateAvatarUrl !== 'undefined') {
        delete window.generateAvatarUrl;
        console.log('✅ Removed legacy generateAvatarUrl');
    }

    if (typeof window.createTeacherCard !== 'undefined') {
        delete window.createTeacherCard;
        console.log('✅ Removed legacy createTeacherCard');
    }

    if (typeof window.renderTeacherCards !== 'undefined') {
        delete window.renderTeacherCards;
        console.log('✅ Removed legacy renderTeacherCards');
    }

    if (typeof window.loadTeachers !== 'undefined') {
        delete window.loadTeachers;
        console.log('✅ Removed legacy loadTeachers');
    }

    // Remove any legacy AVATAR_SERVICE_URL if it exists
    if (typeof window.AVATAR_SERVICE_URL !== 'undefined') {
        delete window.AVATAR_SERVICE_URL;
        console.log('✅ Removed legacy AVATAR_SERVICE_URL');
    }

    // Clean up any old teacher card elements that shouldn't be there
    document.addEventListener('DOMContentLoaded', () => {
        // Remove old teacher card implementations
        const oldTeacherCards = document.querySelectorAll('.ai-teacher-card:not(.shared-teacher-card), .teacher-card:not(.shared-teacher-card)');
        oldTeacherCards.forEach(card => {
            card.remove();
            console.log('✅ Removed old teacher card element');
        });

        // Remove any duplicate containers
        const duplicateContainers = document.querySelectorAll('.teacher-cards-grid:empty, .teacher-grid:empty');
        duplicateContainers.forEach(container => {
            container.remove();
            console.log('✅ Removed empty teacher container');
        });
    });

    console.log('✅ [TeacherCleanup] Cleanup complete');

})();