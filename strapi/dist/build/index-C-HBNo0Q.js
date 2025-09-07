import{r as h,d5 as mc,j as s,d6 as xc,d7 as Va,d8 as Oe,d9 as et,da as Rt,db as Ke,t as ar,dc as vc,dd as Ba,de as pc,df as bc,dg as Dn,dh as W3,di as $c,dj as Cc,dk as va,dl as K1,dm as k3,dn as U3,dp as q3,dq as er,dr as yc,ds as G3,dt as Sc,du as j,s as I,dv as te,dw as Rc,dx as _c,dy as jc,dz as K3,dA as Y3,dB as Ac,dC as Z3,dD as X3,dE as Q3,dF as J3,d1 as it,dG as P3,dH as e6,dI as t6,dJ as n6,dK as r6,dL as o6,dM as a6,dN as i6,dO as s6,dP as c6,dQ as l6,dR as u6,dS as d6,dT as h6,dU as f6,dV as g6,dW as w6,dX as m6,dY as x6,dZ as v6,d_ as p6,d$ as b6,e0 as $6,e1 as C6,e2 as y6,e3 as S6,e4 as Ic,e5 as R6,e6 as _6,e7 as j6,e8 as A6,e9 as I6,w as T6,ea as pa,eb as Da,ec as ba,ed as $a,ee as M6,ef as E6,eg as L6,eh as V6,ei as B6,ej as D6,ek as O6,el as Tc,em as H6,en as Mc,eo as N6,ep as F6,eq as z6,er as W6,es as k6,et as Ec,eu as Lc,ev as U6,ew as q6,ex as G6,ey as K6,ez as Y6,eA as Z6,eB as X6,eC as Q6,eD as J6,eE as P6,eF as e4,eG as t4,eH as n4,eI as r4,eJ as o4,eK as a4,eL as i4,eM as s4,eN as c4,eO as l4,eP as u4,eQ as d4,eR as h4}from"./strapi-CQJ1aB9a.js";var f4=function(e){if(typeof document>"u")return null;var n=Array.isArray(e)?e[0]:e;return n.ownerDocument.body},Pn=new WeakMap,Io=new WeakMap,To={},fa=0,Vc=function(e){return e&&(e.host||Vc(e.parentNode))},g4=function(e,n){return n.map(function(a){if(e.contains(a))return a;var c=Vc(a);return c&&e.contains(c)?c:(console.error("aria-hidden",a,"in not contained inside",e,". Doing nothing"),null)}).filter(function(a){return!!a})},w4=function(e,n,a,c){var o=g4(n,Array.isArray(e)?e:[e]);To[a]||(To[a]=new WeakMap);var l=To[a],u=[],m=new Set,v=new Set(o),R=function(y){!y||m.has(y)||(m.add(y),R(y.parentNode))};o.forEach(R);var C=function(y){!y||v.has(y)||Array.prototype.forEach.call(y.children,function(b){if(m.has(b))C(b);else try{var A=b.getAttribute(c),T=A!==null&&A!=="false",M=(Pn.get(b)||0)+1,V=(l.get(b)||0)+1;Pn.set(b,M),l.set(b,V),u.push(b),M===1&&T&&Io.set(b,!0),V===1&&b.setAttribute(a,"true"),T||b.setAttribute(c,"true")}catch(L){console.error("aria-hidden: cannot operate on ",b,L)}})};return C(n),m.clear(),fa++,function(){u.forEach(function(y){var b=Pn.get(y)-1,A=l.get(y)-1;Pn.set(y,b),l.set(y,A),b||(Io.has(y)||y.removeAttribute(c),Io.delete(y)),A||y.removeAttribute(a)}),fa--,fa||(Pn=new WeakMap,Pn=new WeakMap,Io=new WeakMap,To={})}},Bc=function(e,n,a){a===void 0&&(a="data-aria-hidden");var c=Array.from(Array.isArray(e)?e:[e]),o=f4(e);return o?(c.push.apply(c,Array.from(o.querySelectorAll("[aria-live]"))),w4(c,o,a,"aria-hidden")):function(){return null}};function m4(e){const n=`${e}CollectionProvider`,[a,c]=$c(n),[o,l]=a(n,{collectionRef:{current:null},itemMap:new Map,listeners:new Set}),u=A=>{const{scope:T,children:M}=A,V=h.useRef(null),L=h.useRef(new Map).current,_=h.useRef(new Set).current;return s.jsx(o,{scope:T,itemMap:L,collectionRef:V,listeners:_,children:M})};u.displayName=n;const m=`${e}CollectionSlot`,v=h.forwardRef((A,T)=>{const{scope:M,children:V}=A,L=l(m,M),_=et(T,L.collectionRef);return s.jsx(va,{ref:_,children:V})});v.displayName=m;const R=`${e}CollectionItemSlot`,C="data-radix-collection-item",y=h.forwardRef((A,T)=>{const{scope:M,children:V,...L}=A,_=h.useRef(null),D=et(T,_),N=l(R,M);return h.useEffect(()=>{const z=Array.from(N.itemMap.values());return N.itemMap.set(_,{ref:_,...L}),N.listeners.forEach(X=>X(Array.from(N.itemMap.values()),z)),()=>{const X=Array.from(N.itemMap.values());N.itemMap.delete(_),N.listeners.forEach(q=>q(Array.from(N.itemMap.values()),X))}}),s.jsx(va,{[C]:"",ref:D,children:V})});y.displayName=R;function b(A){const T=l(`${e}CollectionConsumer`,A),M=h.useCallback(()=>{const L=T.collectionRef.current;if(!L)return[];const _=Array.from(L.querySelectorAll(`[${C}]`));return Array.from(T.itemMap.values()).sort((z,X)=>_.indexOf(z.ref.current)-_.indexOf(X.ref.current))},[T.collectionRef,T.itemMap]),V=h.useCallback(L=>(T.listeners.add(L),()=>T.listeners.delete(L)),[T.listeners]);return{getItems:M,subscribe:V}}return[{Provider:u,Slot:v,ItemSlot:y},b,c]}const ga=new Map;function x4(e,n){const a=e+(n?Object.entries(n).sort((o,l)=>o[0]<l[0]?-1:1).join():"");if(ga.has(a))return ga.get(a);const c=new Intl.Collator(e,n);return ga.set(a,c),c}function Oa(e,n){const a=x4(e,{usage:"search",...n});return{startsWith(c,o){return o.length===0?!0:(c=c.normalize("NFC"),o=o.normalize("NFC"),a.compare(c.slice(0,o.length),o)===0)},endsWith(c,o){return o.length===0?!0:(c=c.normalize("NFC"),o=o.normalize("NFC"),a.compare(c.slice(-o.length),o)===0)},contains(c,o){if(o.length===0)return!0;c=c.normalize("NFC"),o=o.normalize("NFC");let l=0;const u=o.length;for(;l+u<=c.length;l++){const m=c.slice(l,l+u);if(a.compare(o,m)===0)return!0}return!1}}}const v4=e=>{const n=h.useRef();return h.useEffect(()=>{n.current=e}),n.current},p4=[" ","Enter","ArrowUp","ArrowDown"],b4=["Enter"],$4=e=>!!(e.length===1&&e.match(/\S| /)),Dc="Combobox",[tr,Er]=m4(Dc),[C4,Yt]=mc(Dc),y4=({children:e})=>s.jsx(Sc,{children:s.jsx(tr.Provider,{scope:void 0,children:e})}),S4=e=>typeof e=="string"?e==="none"?{type:e,filter:void 0}:{type:e,filter:"startsWith"}:e,R4=e=>{const{allowCustomValue:n=!1,autocomplete:a="none",children:c,open:o,defaultOpen:l,onOpenChange:u,value:m,defaultValue:v,onValueChange:R,disabled:C,required:y=!1,locale:b="en-EN",onTextValueChange:A,textValue:T,defaultTextValue:M,filterValue:V,defaultFilterValue:L,onFilterValueChange:_,isPrintableCharacter:D=$4}=e,[N,z]=h.useState(null),[X,q]=h.useState(null),[de,ie]=h.useState(null),[se,$e]=h.useState(null),[ne=!1,P]=er({prop:o,defaultProp:l,onChange:u}),[ee,_e]=er({prop:m,defaultProp:v,onChange:R}),[je,we]=er({prop:T,defaultProp:n&&!M?m:M,onChange:A}),[ye,Me]=er({prop:V,defaultProp:L,onChange:_}),Be=Dn(),he=h.useCallback((me,ze)=>{const Ne=ze.map(oe=>oe.ref.current),[Ye,...K]=Ne,[xe]=K.slice(-1),Se=se??ze.find(oe=>oe.value===ee)?.ref.current;for(const oe of me){if(oe===Se)return;if(oe?.scrollIntoView({block:"nearest"}),oe===Ye&&X&&(X.scrollTop=0),oe===xe&&X&&(X.scrollTop=X.scrollHeight),$e(oe),a==="both"){const ge=ze.find(Ce=>Ce.ref.current===oe);ge&&we(ge.textValue)}if(oe!==Se)return}},[a,we,X,se,ee]),Je=S4(a);return h.useEffect(()=>{a!=="both"&&$e(null)},[je,a]),h.useEffect(()=>{if(de&&N)return Bc([de,N])},[de,N]),s.jsx(y4,{children:s.jsx(C4,{allowCustomValue:n,autocomplete:Je,required:y,trigger:N,onTriggerChange:z,contentId:Be,value:ee,onValueChange:_e,open:ne,onOpenChange:P,disabled:C,locale:b,focusFirst:he,textValue:je,onTextValueChange:we,onViewportChange:q,onContentChange:ie,visuallyFocussedItem:se,filterValue:ye,onFilterValueChange:Me,onVisuallyFocussedItemChange:$e,isPrintableCharacter:D,children:c})})},Oc="ComboboxTrigger",Hc=h.forwardRef((e,n)=>{const{...a}=e,c=Yt(Oc),o=()=>{c.disabled||c.onOpenChange(!0)};return s.jsx(xc,{asChild:!0,children:s.jsx(Va,{asChild:!0,trapped:c.open,onMountAutoFocus:l=>{l.preventDefault()},onUnmountAutoFocus:l=>{c.trigger?.focus({preventScroll:!0}),document.getSelection()?.empty(),l.preventDefault()},children:s.jsx("div",{ref:n,"data-disabled":c.disabled?"":void 0,...a,onClick:Oe(a.onClick,l=>{if(c.disabled){l.preventDefault();return}c.trigger?.focus()}),onPointerDown:Oe(a.onPointerDown,l=>{if(c.disabled){l.preventDefault();return}const u=l.target;u.hasPointerCapture(l.pointerId)&&u.releasePointerCapture(l.pointerId),(u.closest("button")??u.closest("div"))===l.currentTarget&&l.button===0&&l.ctrlKey===!1&&(o(),c.trigger?.focus())})})})})});Hc.displayName=Oc;const Nc="ComboboxInput",Fc=h.forwardRef((e,n)=>{const a=Yt(Nc),c=h.useRef(null),{getItems:o}=Er(void 0),{startsWith:l}=Oa(a.locale,{sensitivity:"base"}),u=a.disabled,m=et(c,n,a.onTriggerChange),v=()=>{u||a.onOpenChange(!0)},R=v4(a.filterValue);return Rt(()=>{const C=setTimeout(()=>{if(a.textValue===""||a.textValue===void 0||a.filterValue===""||a.filterValue===void 0)return;const y=o().find(A=>A.type==="option"&&l(A.textValue,a.textValue)),b=F4(R??"",a.filterValue);y&&!a.visuallyFocussedItem&&b===a.filterValue.length&&c.current?.setSelectionRange(a.filterValue.length,a.textValue.length)});return()=>clearTimeout(C)},[a.textValue,a.filterValue,l,a.visuallyFocussedItem,o,R]),s.jsx("input",{type:"text",role:"combobox","aria-controls":a.contentId,"aria-expanded":a.open,"aria-required":a.required,"aria-autocomplete":a.autocomplete.type,"data-state":a.open?"open":"closed","aria-disabled":u,"aria-activedescendant":a.visuallyFocussedItem?.id,disabled:u,"data-disabled":u?"":void 0,"data-placeholder":a.textValue===void 0?"":void 0,value:a.textValue??"",...e,ref:m,onKeyDown:Oe(e.onKeyDown,C=>{if(["ArrowUp","ArrowDown","Home","End"].includes(C.key))a.open||v(),setTimeout(()=>{let b=o().filter(A=>!A.disabled&&A.isVisible).map(A=>A.ref.current);if(["ArrowUp","End"].includes(C.key)&&(b=b.slice().reverse()),["ArrowUp","ArrowDown"].includes(C.key)){const A=a.visuallyFocussedItem??o().find(T=>T.value===a.value)?.ref.current;if(A){let T=b.indexOf(A);T===b.length-1&&(T=-1),b=b.slice(T+1)}}if(["ArrowDown"].includes(C.key)&&a.autocomplete.type==="both"&&b.length>1){const[A,...T]=b,M=o().find(V=>V.ref.current===A).textValue;a.textValue===M&&(b=T)}a.focusFirst(b,o())}),C.preventDefault();else if(["Tab"].includes(C.key)&&a.open)C.preventDefault();else if(["Escape"].includes(C.key))a.open?a.onOpenChange(!1):(a.onValueChange(void 0),a.onTextValueChange("")),C.preventDefault();else if(b4.includes(C.key)){if(a.visuallyFocussedItem){const y=o().find(b=>b.ref.current===a.visuallyFocussedItem);y&&(a.onValueChange(y.value),a.onTextValueChange(y.textValue),a.autocomplete.type==="both"&&a.onFilterValueChange(y.textValue),y.ref.current?.click())}else{const y=o().find(b=>b.type==="option"&&!b.disabled&&b.textValue===a.textValue);y&&(a.onValueChange(y.value),a.onTextValueChange(y.textValue),a.autocomplete.type==="both"&&a.onFilterValueChange(y.textValue),y.ref.current?.click())}a.onOpenChange(!1),C.preventDefault()}else a.onVisuallyFocussedItemChange(null)}),onChange:Oe(e.onChange,C=>{a.onTextValueChange(C.currentTarget.value),a.autocomplete.type==="both"&&a.onFilterValueChange(C.currentTarget.value)}),onKeyUp:Oe(e.onKeyUp,C=>{if(!a.open&&(a.isPrintableCharacter(C.key)||["Backspace"].includes(C.key))&&v(),setTimeout(()=>{if(a.autocomplete.type==="both"&&a.isPrintableCharacter(C.key)&&a.filterValue!==void 0){const y=a.filterValue,b=o().find(A=>l(A.textValue,y));b&&a.onTextValueChange(b.textValue)}}),a.autocomplete.type==="none"&&a.isPrintableCharacter(C.key)){const y=a.textValue??"",b=o().find(A=>l(A.textValue,y));b&&(a.onVisuallyFocussedItemChange(b.ref.current),b.ref.current?.scrollIntoView())}}),onBlur:Oe(e.onBlur,()=>{if(a.open)return;a.onVisuallyFocussedItemChange(null);const[C]=o().filter(b=>b.textValue===a.textValue&&b.type==="option");if(C){a.onValueChange(C.value),a.autocomplete.type==="both"&&a.onFilterValueChange(C.textValue);return}if(a.allowCustomValue){a.onValueChange(a.textValue),a.autocomplete.type==="both"&&a.onFilterValueChange(a.textValue);return}const[y]=o().filter(b=>b.value===a.value&&b.type==="option");y&&a.textValue!==""?(a.onTextValueChange(y.textValue),a.autocomplete.type==="both"&&a.onFilterValueChange(y.textValue)):(a.onValueChange(void 0),a.onTextValueChange(""))})})});Fc.displayName="ComboboxTextInput";const zc=h.forwardRef((e,n)=>{const{children:a,...c}=e,o=Yt(Nc),l=o.disabled,u=()=>{l||(o.onOpenChange(!0),o.trigger?.focus())};return s.jsx(Ke.button,{"aria-hidden":!0,type:"button","aria-disabled":l,"aria-controls":o.contentId,"aria-expanded":o.open,disabled:l,"data-disabled":l?"":void 0,...c,tabIndex:-1,ref:n,onClick:Oe(c.onClick,()=>{o.trigger?.focus()}),onPointerDown:Oe(c.onPointerDown,m=>{m.button===0&&m.ctrlKey===!1&&(u(),m.preventDefault())}),onKeyDown:Oe(c.onKeyDown,m=>{p4.includes(m.key)&&(u(),m.preventDefault())}),children:a||"▼"})});zc.displayName="ComboboxIcon";const _4="ComboboxPortal",Wc=e=>s.jsx(yc,{asChild:!0,...e});Wc.displayName=_4;const Ha="ComboboxContent",kc=h.forwardRef((e,n)=>{const a=Yt(Ha),{getItems:c}=Er(void 0),[o,l]=h.useState();if(Rt(()=>{l(new DocumentFragment)},[]),Rt(()=>{a.open&&a.autocomplete.type==="none"&&setTimeout(()=>{c().find(m=>m.value===a.value)?.ref.current?.scrollIntoView({block:"nearest"})})},[c,a.autocomplete,a.value,a.open]),!a.open){const u=o;return u?ar.createPortal(s.jsx(tr.Slot,{scope:void 0,children:s.jsx("div",{children:e.children})}),u):null}return s.jsx(Uc,{...e,ref:n})});kc.displayName=Ha;const j4=10,Uc=h.forwardRef((e,n)=>{const{onEscapeKeyDown:a,onPointerDownOutside:c,...o}=e,l=Yt(Ha),u=et(n,v=>l.onContentChange(v)),{onOpenChange:m}=l;return vc(),h.useEffect(()=>{const v=()=>{m(!1)};return window.addEventListener("blur",v),window.addEventListener("resize",v),()=>{window.removeEventListener("blur",v),window.removeEventListener("resize",v)}},[m]),s.jsx(Ba,{allowPinchZoom:!0,children:s.jsx(pc,{asChild:!0,onEscapeKeyDown:a,onPointerDownOutside:c,onFocusOutside:v=>{v.preventDefault()},onDismiss:()=>{l.onOpenChange(!1),l.trigger?.focus({preventScroll:!0})},children:s.jsx(qc,{role:"listbox",id:l.contentId,"data-state":l.open?"open":"closed",onContextMenu:v=>v.preventDefault(),...o,ref:u,style:{display:"flex",flexDirection:"column",outline:"none",...o.style}})})})});Uc.displayName="ComboboxContentImpl";const qc=h.forwardRef((e,n)=>{const{align:a="start",collisionPadding:c=j4,...o}=e;return s.jsx(bc,{...o,ref:n,align:a,collisionPadding:c,style:{boxSizing:"border-box",...o.style,"--radix-combobox-content-transform-origin":"var(--radix-popper-transform-origin)","--radix-combobox-content-available-width":"var(--radix-popper-available-width)","--radix-combobox-content-available-height":"var(--radix-popper-available-height)","--radix-combobox-trigger-width":"var(--radix-popper-anchor-width)","--radix-combobox-trigger-height":"var(--radix-popper-anchor-height)"}})});qc.displayName="ComboboxPopperPosition";const Gc="ComboboxViewport",Kc=h.forwardRef((e,n)=>{const a=Yt(Gc),c=et(n,a.onViewportChange);return s.jsxs(s.Fragment,{children:[s.jsx("style",{dangerouslySetInnerHTML:{__html:"[data-radix-combobox-viewport]{scrollbar-width:none;-ms-overflow-style:none;-webkit-overflow-scrolling:touch;}[data-radix-combobox-viewport]::-webkit-scrollbar{display:none}"}}),s.jsx(tr.Slot,{scope:void 0,children:s.jsx(Ke.div,{"data-radix-combobox-viewport":"",role:"presentation",...e,ref:c,style:{position:"relative",flex:1,overflow:"auto",...e.style}})})]})});Kc.displayName=Gc;const Bo="ComboboxItem",[Y1,Na]=mc(Bo),Fa=h.forwardRef((e,n)=>{const{value:a,disabled:c=!1,textValue:o,...l}=e,[u,m]=h.useState();Rt(()=>{m(new DocumentFragment)},[]);const{onTextValueChange:v,textValue:R,...C}=Yt(Bo),y=Dn(),[b,A]=h.useState(o??""),T=C.value===a,{startsWith:M,contains:V}=Oa(C.locale,{sensitivity:"base"}),L=h.useCallback(_=>{A(D=>D||(_?.textContent??"").trim())},[]);return h.useEffect(()=>{T&&R===void 0&&b!==""&&v(b)},[b,T,R,v]),C.autocomplete.type==="both"&&b&&C.filterValue&&!M(b,C.filterValue)||C.autocomplete.type==="list"&&C.autocomplete.filter==="startsWith"&&b&&R&&!M(b,R)||C.autocomplete.type==="list"&&C.autocomplete.filter==="contains"&&b&&R&&!V(b,R)?u?ar.createPortal(s.jsx(Y1,{textId:y,onTextValueChange:L,isSelected:T,textValue:b,children:s.jsx(tr.ItemSlot,{scope:void 0,value:a,textValue:b,disabled:c,type:"option",isVisible:!1,children:s.jsx(Ca,{ref:n,value:a,disabled:c,...l})})}),u):null:s.jsx(Y1,{textId:y,onTextValueChange:L,isSelected:T,textValue:b,children:s.jsx(tr.ItemSlot,{scope:void 0,value:a,textValue:b,disabled:c,type:"option",isVisible:!0,children:s.jsx(Ca,{ref:n,value:a,disabled:c,...l})})})});Fa.displayName=Bo;const Yc="ComboboxItemImpl",Ca=h.forwardRef((e,n)=>{const{value:a,disabled:c=!1,...o}=e,l=h.useRef(null),u=et(n,l),{getItems:m}=Er(void 0),{onTextValueChange:v,visuallyFocussedItem:R,...C}=Yt(Bo),{isSelected:y,textValue:b,textId:A}=Na(Yc),T=()=>{c||(C.onValueChange(a),v(b),C.onOpenChange(!1),C.autocomplete.type==="both"&&C.onFilterValueChange(b),C.trigger?.focus({preventScroll:!0}))},M=h.useMemo(()=>R===m().find(L=>L.ref.current===l.current)?.ref.current,[m,R]),V=Dn();return s.jsx(Ke.div,{role:"option","aria-labelledby":A,"data-highlighted":M?"":void 0,"aria-selected":y&&M,"data-state":y?"checked":"unchecked","aria-disabled":c||void 0,"data-disabled":c?"":void 0,tabIndex:c?void 0:-1,...o,id:V,ref:u,onPointerUp:Oe(o.onPointerUp,T)})});Ca.displayName=Yc;const Zc="ComboboxItemText",Xc=h.forwardRef((e,n)=>{const{className:a,style:c,...o}=e,l=Na(Zc),u=et(n,l.onTextValueChange);return s.jsx(Ke.span,{id:l.textId,...o,ref:u})});Xc.displayName=Zc;const Qc="ComboboxItemIndicator",Jc=h.forwardRef((e,n)=>{const{isSelected:a}=Na(Qc);return a?s.jsx(Ke.span,{"aria-hidden":!0,...e,ref:n}):null});Jc.displayName=Qc;const za="ComboboxNoValueFound",Pc=h.forwardRef((e,n)=>{const{textValue:a="",filterValue:c="",locale:o,autocomplete:l}=Yt(za),[u,m]=h.useState([]),{subscribe:v}=Er(void 0),{startsWith:R,contains:C}=Oa(o,{sensitivity:"base"});return h.useEffect(()=>{const y=v(b=>{m(b)});return()=>{y()}},[v]),l.type==="list"&&l.filter==="startsWith"&&u.some(y=>R(y.textValue,a))||l.type==="both"&&u.some(y=>R(y.textValue,c))||l.type==="list"&&l.filter==="contains"&&u.some(y=>C(y.textValue,a))?null:s.jsx(Ke.div,{...e,ref:n})});Pc.displayName=za;const el=h.forwardRef((e,n)=>{const{disabled:a=!1,...c}=e,o=Yt(za),{textValue:l,visuallyFocussedItem:u}=o,{getItems:m,subscribe:v}=Er(void 0),R=h.useRef(null),[C,y]=h.useState(!1),b=et(n,R),A=h.useMemo(()=>u===m().find(V=>V.ref.current===R.current)?.ref.current,[m,u]),T=Dn(),M=()=>{!a&&l&&(o.onValueChange(l),o.onTextValueChange(l),o.onOpenChange(!1),o.autocomplete.type==="both"&&o.onFilterValueChange(l),o.trigger?.focus({preventScroll:!0}))};return Rt(()=>{const V=v(L=>{y(!L.some(_=>_.textValue===l&&_.type!=="create"))});return m().length===0&&y(!0),()=>{V()}},[l,v,m]),!l||!C?null:s.jsx(tr.ItemSlot,{scope:void 0,value:l??"",textValue:l??"",disabled:a,isVisible:!0,type:"create",children:s.jsx(Ke.div,{role:"option",tabIndex:a?void 0:-1,"aria-disabled":a||void 0,"data-disabled":a?"":void 0,"data-highlighted":A?"":void 0,...c,id:T,ref:b,onPointerUp:Oe(c.onPointerUp,M)})})});el.displayName="ComboboxCreateItem";const A4=R4,I4=Hc,T4=Fc,M4=zc,E4=Wc,L4=kc,V4=Kc,B4=Fa,D4=Xc,O4=Jc,H4=Pc,N4=el;function F4(e,n){const a=Math.min(e.length,n.length);for(let c=0;c<a;c++)if(e[c]!==n[c])return c;return a}const Ft=Object.freeze(Object.defineProperty({__proto__:null,ComboboxItem:Fa,Content:L4,CreateItem:N4,Icon:M4,Item:B4,ItemIndicator:O4,ItemText:D4,NoValueFound:H4,Portal:E4,Root:A4,TextInput:T4,Trigger:I4,Viewport:V4},Symbol.toStringTag,{value:"Module"}));function Wa(e){const n=h.useRef(e);return h.useEffect(()=>{n.current=e}),h.useMemo(()=>(...a)=>n.current?.(...a),[])}const z4=[" ","Enter","ArrowUp","ArrowDown"],W4=[" ","Enter"],Lr="Select",[Do,Vr,k4]=W3(Lr),[ir,U4]=$c(Lr,[k4,Cc]),Oo=Cc(),[q4,cn]=ir(Lr),[G4,K4]=ir(Lr),ka=e=>{const{__scopeSelect:n,children:a,open:c,defaultOpen:o,onOpenChange:l,value:u,defaultValue:m,onValueChange:v,dir:R,disabled:C,required:y,multi:b=!1}=e,A=Oo(n),[T,M]=h.useState(null),[V,L]=h.useState(null),[_,D]=h.useState(!1),N=G3(R),[z=!1,X]=er({prop:c,defaultProp:o,onChange:l}),[q,de]=er({prop:u,defaultProp:m,onChange(ne){v&&(Array.isArray(ne),v(ne))}}),ie=h.useRef(null),[se,$e]=h.useState(new Set);return s.jsx(Sc,{...A,children:s.jsx(q4,{required:y,scope:n,trigger:T,onTriggerChange:M,valueNode:V,onValueNodeChange:L,valueNodeHasChildren:_,onValueNodeHasChildrenChange:D,contentId:Dn(),value:q,onValueChange:de,open:z,onOpenChange:X,dir:N,triggerPointerDownPosRef:ie,disabled:C,multi:b,children:s.jsx(Do.Provider,{scope:n,children:s.jsx(G4,{scope:e.__scopeSelect,onNativeOptionAdd:h.useCallback(ne=>{$e(P=>new Set(P).add(ne))},[]),onNativeOptionRemove:h.useCallback(ne=>{$e(P=>{const ee=new Set(P);return ee.delete(ne),ee})},[]),children:a})})})})};ka.displayName=Lr;const tl="SelectTrigger",Ua=h.forwardRef((e,n)=>{const{__scopeSelect:a,...c}=e,o=Oo(a),l=cn(tl,a),u=l.disabled,m=et(n,l.onTriggerChange),v=Vr(a),[R,C,y]=ul(A=>{const T=v().filter(L=>!L.disabled),M=T.find(L=>L.value===l.value),V=dl(T,A,M);if(V!==void 0&&!Array.isArray(V.value)){const L=l.multi?[V.value]:V.value;l.onValueChange(L)}}),b=()=>{u||(l.onOpenChange(!0),y())};return s.jsx(xc,{asChild:!0,...o,children:s.jsx(Ke.div,{role:"combobox","aria-controls":l.contentId,"aria-expanded":l.open,"aria-required":l.required,"aria-autocomplete":"none",dir:l.dir,"data-state":l.open?"open":"closed","data-disabled":u?"":void 0,"data-placeholder":l.value===void 0?"":void 0,tabIndex:u?void 0:0,...c,ref:m,onClick:Oe(c.onClick,A=>{A.currentTarget.focus()}),onPointerDown:Oe(c.onPointerDown,A=>{const T=A.target;T.hasPointerCapture(A.pointerId)&&T.releasePointerCapture(A.pointerId),(T.closest("button")??T.closest("div"))===A.currentTarget&&A.button===0&&A.ctrlKey===!1&&(b(),l.triggerPointerDownPosRef.current={x:Math.round(A.pageX),y:Math.round(A.pageY)},A.preventDefault())}),onKeyDown:Oe(c.onKeyDown,A=>{const T=R.current!=="",M=A.ctrlKey||A.altKey||A.metaKey,V=A.target;(V.closest("button")??V.closest("div"))===A.currentTarget&&(!M&&A.key.length===1&&C(A.key),!(T&&A.key===" ")&&z4.includes(A.key)&&(b(),A.preventDefault()))})})})});Ua.displayName=tl;const nl="SelectValue",qa=h.forwardRef((e,n)=>{const{__scopeSelect:a,children:c,placeholder:o,...l}=e,u=cn(nl,a),{onValueNodeHasChildrenChange:m}=u,v=c!==void 0,R=et(n,u.onValueNodeChange),[C,y]=h.useState([]),b=Vr(a);Rt(()=>{m(v)},[m,v]),h.useLayoutEffect(()=>{if(Array.isArray(u.value)&&C.length!==u.value.length){const T=setTimeout(()=>{const M=b().filter(V=>Array.isArray(V.value)?!1:u.value?.includes(V.value));y(M)});return()=>{clearTimeout(T)}}},[u.value,b,C]);let A;if((u.value===void 0||u.value.length===0)&&o!==void 0)A=s.jsx("span",{children:o});else if(typeof c=="function")if(Array.isArray(u.value)){const T=u.value.map(M=>{const V=C.find(L=>L.value===M);return V?c({value:M,textValue:V?.textValue}):null});A=T.every(M=>M===null)?o:T}else A=c(u.value);else A=c;return s.jsx(Ke.span,{...l,ref:R,children:A||null})});qa.displayName=nl;const Y4="SelectIcon",Ga=h.forwardRef((e,n)=>{const{__scopeSelect:a,children:c,...o}=e;return s.jsx(Ke.span,{"aria-hidden":!0,...o,ref:n,children:c||"▼"})});Ga.displayName=Y4;const Z4="SelectPortal",Ka=e=>s.jsx(yc,{asChild:!0,...e});Ka.displayName=Z4;const Ln="SelectContent",Ya=h.forwardRef((e,n)=>{const a=cn(Ln,e.__scopeSelect),[c,o]=h.useState();if(Rt(()=>{o(new DocumentFragment)},[]),!a.open){const l=c;return l?ar.createPortal(s.jsx(rl,{scope:e.__scopeSelect,children:s.jsx(Do.Slot,{scope:e.__scopeSelect,children:s.jsx("div",{children:e.children})})}),l):null}return s.jsx(ol,{...e,ref:n})});Ya.displayName=Ln;const an=10,[rl,pn]=ir(Ln),X4="SelectContentImpl",ol=h.forwardRef((e,n)=>{const{__scopeSelect:a,position:c="item-aligned",onCloseAutoFocus:o,onEscapeKeyDown:l,onPointerDownOutside:u,side:m,sideOffset:v,align:R,alignOffset:C,arrowPadding:y,collisionBoundary:b,collisionPadding:A,sticky:T,hideWhenDetached:M,avoidCollisions:V,...L}=e,_=cn(Ln,a),[D,N]=h.useState(null),[z,X]=h.useState(null),q=et(n,K=>N(K)),[de,ie]=h.useState(null),[se,$e]=h.useState(null),ne=Vr(a),[P,ee]=h.useState(!1),_e=h.useRef(!1);h.useEffect(()=>{if(D)return Bc(D)},[D]),vc();const je=h.useCallback(K=>{const[xe,...Se]=ne().map(Ce=>Ce.ref.current),[oe]=Se.slice(-1),ge=document.activeElement;for(const Ce of K)if(Ce===ge||(Ce?.scrollIntoView({block:"nearest"}),Ce===xe&&z&&(z.scrollTop=0),Ce===oe&&z&&(z.scrollTop=z.scrollHeight),Ce?.focus(),document.activeElement!==ge))return},[ne,z]),we=h.useCallback(()=>je([de,D]),[je,de,D]);h.useEffect(()=>{P&&we()},[P,we]);const{onOpenChange:ye,triggerPointerDownPosRef:Me}=_;h.useEffect(()=>{if(D){let K={x:0,y:0};const xe=oe=>{K={x:Math.abs(Math.round(oe.pageX)-(Me.current?.x??0)),y:Math.abs(Math.round(oe.pageY)-(Me.current?.y??0))}},Se=oe=>{K.x<=10&&K.y<=10?oe.preventDefault():D.contains(oe.target)||ye(!1),document.removeEventListener("pointermove",xe),Me.current=null};return Me.current!==null&&(document.addEventListener("pointermove",xe),document.addEventListener("pointerup",Se,{capture:!0,once:!0})),()=>{document.removeEventListener("pointermove",xe),document.removeEventListener("pointerup",Se,{capture:!0})}}},[D,ye,Me]),h.useEffect(()=>{const K=()=>ye(!1);return window.addEventListener("blur",K),window.addEventListener("resize",K),()=>{window.removeEventListener("blur",K),window.removeEventListener("resize",K)}},[ye]);const[Be,he]=ul(K=>{const xe=ne().filter(ge=>!ge.disabled),Se=xe.find(ge=>ge.ref.current===document.activeElement),oe=dl(xe,K,Se);oe&&setTimeout(()=>oe.ref.current.focus())}),Je=h.useCallback((K,xe,Se)=>{const oe=!_e.current&&!Se;(_.value!==void 0&&_.value===xe||oe)&&(ie(K),oe&&(_e.current=!0))},[_.value]),me=h.useCallback(()=>D?.focus(),[D]),ze=h.useCallback((K,xe,Se)=>{const oe=!_e.current&&!Se;(_.value!==void 0&&(Array.isArray(xe)?xe.every(Ce=>_.value?.includes(Ce)):_.value===xe)||oe)&&$e(K)},[_.value]),Ne=c==="popper"?ya:al,Ye=Ne===ya?{side:m,sideOffset:v,align:R,alignOffset:C,arrowPadding:y,collisionBoundary:b,collisionPadding:A,sticky:T,hideWhenDetached:M,avoidCollisions:V}:{};return s.jsx(rl,{scope:a,content:D,viewport:z,onViewportChange:X,itemRefCallback:Je,selectedItem:de,onItemLeave:me,itemTextRefCallback:ze,focusSelectedItem:we,selectedItemText:se,position:c,isPositioned:P,searchRef:Be,children:s.jsx(Ba,{as:va,allowPinchZoom:!0,children:s.jsx(Va,{asChild:!0,trapped:_.open,onMountAutoFocus:K=>{K.preventDefault()},onUnmountAutoFocus:Oe(o,K=>{_.trigger?.focus({preventScroll:!0}),document.getSelection()?.empty(),K.preventDefault()}),children:s.jsx(pc,{asChild:!0,disableOutsidePointerEvents:!0,onEscapeKeyDown:l,onPointerDownOutside:u,onFocusOutside:K=>K.preventDefault(),onDismiss:()=>_.onOpenChange(!1),children:s.jsx(Ne,{role:"listbox",id:_.contentId,"data-state":_.open?"open":"closed","aria-multiselectable":_.multi?"true":void 0,dir:_.dir,onContextMenu:K=>K.preventDefault(),...L,...Ye,onPlaced:()=>ee(!0),ref:q,style:{display:"flex",flexDirection:"column",outline:"none",...L.style},onKeyDown:Oe(L.onKeyDown,K=>{const xe=K.ctrlKey||K.altKey||K.metaKey;if(K.key==="Tab"&&K.preventDefault(),!xe&&K.key.length===1&&he(K.key),["ArrowUp","ArrowDown","Home","End"].includes(K.key)){let oe=ne().filter(ge=>!ge.disabled).map(ge=>ge.ref.current);if(["ArrowUp","End"].includes(K.key)&&(oe=oe.slice().reverse()),["ArrowUp","ArrowDown"].includes(K.key)){const ge=K.target,Ce=oe.indexOf(ge);oe=oe.slice(Ce+1)}setTimeout(()=>je(oe)),K.preventDefault()}})})})})})})});ol.displayName=X4;const Q4="SelectItemAlignedPosition",al=h.forwardRef((e,n)=>{const{__scopeSelect:a,onPlaced:c,...o}=e,l=cn(Ln,a),u=pn(Ln,a),[m,v]=h.useState(null),[R,C]=h.useState(null),y=et(n,q=>C(q)),b=Vr(a),A=h.useRef(!1),T=h.useRef(!0),{viewport:M,selectedItem:V,selectedItemText:L,focusSelectedItem:_}=u,D=h.useCallback(()=>{if(l.trigger&&l.valueNode&&m&&R&&M&&V&&L){const q=l.trigger.getBoundingClientRect(),de=R.getBoundingClientRect(),ie=l.valueNode.getBoundingClientRect(),se=L.getBoundingClientRect();if(l.dir!=="rtl"){const ge=se.left-de.left,Ce=ie.left-ge,rt=q.left-Ce,Ee=q.width+rt,Ae=Math.max(Ee,de.width),_t=window.innerWidth-an,Ze=K1(Ce,[an,_t-Ae]);m.style.minWidth=`${Ee}px`,m.style.left=`${Ze}px`}else{const ge=de.right-se.right,Ce=window.innerWidth-ie.right-ge,rt=window.innerWidth-q.right-Ce,Ee=q.width+rt,Ae=Math.max(Ee,de.width),_t=window.innerWidth-an,Ze=K1(Ce,[an,_t-Ae]);m.style.minWidth=`${Ee}px`,m.style.right=`${Ze}px`}const $e=b(),ne=window.innerHeight-an*2,P=M.scrollHeight,ee=window.getComputedStyle(R),_e=parseInt(ee.borderTopWidth,10),je=parseInt(ee.paddingTop,10),we=parseInt(ee.borderBottomWidth,10),ye=parseInt(ee.paddingBottom,10),Me=_e+je+P+ye+we,Be=Math.min(V.offsetHeight*5,Me),he=window.getComputedStyle(M),Je=parseInt(he.paddingTop,10),me=parseInt(he.paddingBottom,10),ze=q.top+q.height/2-an,Ne=ne-ze,Ye=V.offsetHeight/2,K=V.offsetTop+Ye,xe=_e+je+K,Se=Me-xe;if(xe<=ze){const ge=V===$e[$e.length-1].ref.current;m.style.bottom="0px";const Ce=R.clientHeight-M.offsetTop-M.offsetHeight,rt=Math.max(Ne,Ye+(ge?me:0)+Ce+we),Ee=xe+rt;m.style.height=`${Ee}px`}else{const ge=V===$e[0].ref.current;m.style.top="0px";const rt=Math.max(ze,_e+M.offsetTop+(ge?Je:0)+Ye)+Se;m.style.height=`${rt}px`,M.scrollTop=xe-ze+M.offsetTop}m.style.margin=`${an}px 0`,m.style.minHeight=`${Be}px`,m.style.maxHeight=`${ne}px`,c?.(),requestAnimationFrame(()=>A.current=!0)}},[b,l.trigger,l.valueNode,m,R,M,V,L,l.dir,c]);Rt(()=>D(),[D]);const[N,z]=h.useState();Rt(()=>{R&&z(window.getComputedStyle(R).zIndex)},[R]);const X=h.useCallback(q=>{q&&T.current===!0&&(D(),_?.(),T.current=!1)},[D,_]);return s.jsx(P4,{scope:a,contentWrapper:m,shouldExpandOnScrollRef:A,onScrollButtonChange:X,children:s.jsx("div",{ref:v,style:{display:"flex",flexDirection:"column",position:"fixed",zIndex:N},children:s.jsx(Ke.div,{...o,ref:y,style:{boxSizing:"border-box",maxHeight:"100%",...o.style}})})})});al.displayName=Q4;const J4="SelectPopperPosition",ya=h.forwardRef((e,n)=>{const{__scopeSelect:a,align:c="start",collisionPadding:o=an,...l}=e,u=Oo(a);return s.jsx(bc,{...u,...l,ref:n,align:c,collisionPadding:o,style:{boxSizing:"border-box",...l.style,"--radix-select-content-transform-origin":"var(--radix-popper-transform-origin)","--radix-select-content-available-width":"var(--radix-popper-available-width)","--radix-select-content-available-height":"var(--radix-popper-available-height)","--radix-select-trigger-width":"var(--radix-popper-anchor-width)","--radix-select-trigger-height":"var(--radix-popper-anchor-height)"}})});ya.displayName=J4;const[P4,Za]=ir(Ln,{}),Sa="SelectViewport",Xa=h.forwardRef((e,n)=>{const{__scopeSelect:a,...c}=e,o=pn(Sa,a),l=Za(Sa,a),u=et(n,o.onViewportChange),m=h.useRef(0);return s.jsxs(s.Fragment,{children:[s.jsx("style",{dangerouslySetInnerHTML:{__html:"[data-radix-select-viewport]{scrollbar-width:none;-ms-overflow-style:none;-webkit-overflow-scrolling:touch;}[data-radix-select-viewport]::-webkit-scrollbar{display:none}"}}),s.jsx(Do.Slot,{scope:a,children:s.jsx(Ke.div,{"data-radix-select-viewport":"",role:"presentation",...c,ref:u,style:{position:"relative",flex:1,overflow:"auto",...c.style},onScroll:Oe(c.onScroll,v=>{const R=v.currentTarget,{contentWrapper:C,shouldExpandOnScrollRef:y}=l;if(y?.current&&C){const b=Math.abs(m.current-R.scrollTop);if(b>0){const A=window.innerHeight-an*2,T=parseFloat(C.style.minHeight),M=parseFloat(C.style.height),V=Math.max(T,M);if(V<A){const L=V+b,_=Math.min(A,L),D=L-_;C.style.height=`${_}px`,C.style.bottom==="0px"&&(R.scrollTop=D>0?D:0,C.style.justifyContent="flex-end")}}}m.current=R.scrollTop})})})]})});Xa.displayName=Sa;const il="SelectGroup",[ew,tw]=ir(il),Qa=h.forwardRef((e,n)=>{const{__scopeSelect:a,...c}=e,o=Dn();return s.jsx(ew,{scope:a,id:o,children:s.jsx(Ke.div,{role:"group","aria-labelledby":o,...c,ref:n})})});Qa.displayName=il;const sl="SelectLabel",Ja=h.forwardRef((e,n)=>{const{__scopeSelect:a,...c}=e,o=tw(sl,a);return s.jsx(Ke.div,{id:o.id,...c,ref:n})});Ja.displayName=sl;const Eo="SelectItem",[nw,cl]=ir(Eo),Pa=h.forwardRef((e,n)=>{const{__scopeSelect:a,value:c,disabled:o=!1,textValue:l,...u}=e,m=cn(Eo,a),v=pn(Eo,a),R=typeof c=="string"?Array.isArray(m.value)?m.value.includes(c):m.value===c:c.every(_=>m.value?.includes(_)),C=Array.isArray(m.value)&&Array.isArray(c)&&c.some(_=>m.value?.includes(_)),[y,b]=h.useState(l??""),[A,T]=h.useState(!1),M=et(n,_=>v.itemRefCallback?.(_,c,o)),V=Dn(),L=()=>{if(!o){let _=m.multi&&typeof c=="string"?[c]:c;C&&!R?m.onValueChange(_):Array.isArray(m.value)&&(_=hl(c,m.value)),m.onValueChange(_),m.multi||m.onOpenChange(!1)}};if(!m.multi&&Array.isArray(c))throw new Error("You can only pass an array of values in multi selects");return s.jsx(nw,{scope:a,value:c,disabled:o,textId:V,isSelected:R,isIntermediate:C,onItemTextChange:h.useCallback(_=>{b(D=>D||(_?.textContent??"").trim())},[]),children:s.jsx(Do.ItemSlot,{scope:a,value:c,disabled:o,textValue:y,children:s.jsx(Ke.div,{role:"option","aria-labelledby":V,"data-highlighted":A?"":void 0,"aria-selected":m.multi?void 0:R&&A,"aria-checked":m.multi?R:void 0,"data-state":R?"checked":"unchecked","aria-disabled":o||void 0,"data-disabled":o?"":void 0,tabIndex:o?void 0:-1,...u,ref:M,onFocus:Oe(u.onFocus,()=>T(!0)),onBlur:Oe(u.onBlur,()=>T(!1)),onPointerUp:Oe(u.onPointerUp,L),onPointerMove:Oe(u.onPointerMove,_=>{o?v.onItemLeave?.():_.currentTarget.focus({preventScroll:!0})}),onPointerLeave:Oe(u.onPointerLeave,_=>{_.currentTarget===document.activeElement&&v.onItemLeave?.()}),onKeyDown:Oe(u.onKeyDown,_=>{v.searchRef?.current!==""&&_.key===" "||(W4.includes(_.key)&&L(),_.key===" "&&_.preventDefault())})})})})});Pa.displayName=Eo;const Ir="SelectItemText",ei=h.forwardRef((e,n)=>{const{__scopeSelect:a,className:c,style:o,...l}=e,u=cn(Ir,a),m=pn(Ir,a),v=cl(Ir,a),R=K4(Ir,a),[C,y]=h.useState(null),b=et(n,L=>y(L),v.onItemTextChange,L=>m.itemTextRefCallback?.(L,v.value,v.disabled)),A=C?.textContent,T=h.useMemo(()=>s.jsx("option",{value:v.value,disabled:v.disabled,children:A},Array.isArray(v.value)?v.value.join(";"):v.value),[v.disabled,v.value,A]),{onNativeOptionAdd:M,onNativeOptionRemove:V}=R;return Rt(()=>(M(T),()=>V(T)),[M,V,T]),s.jsxs(s.Fragment,{children:[s.jsx(Ke.span,{id:v.textId,...l,ref:b}),v.isSelected&&u.valueNode&&!u.valueNodeHasChildren?ar.createPortal(l.children,u.valueNode):null]})});ei.displayName=Ir;const ll="SelectItemIndicator",ti=h.forwardRef((e,n)=>{const{__scopeSelect:a,children:c,...o}=e,l=cl(ll,a);return typeof c=="function"?s.jsx(Ke.span,{"aria-hidden":!0,...o,ref:n,children:c({isSelected:l.isSelected,isIntermediate:l.isIntermediate})}):l.isSelected?s.jsx(Ke.span,{"aria-hidden":!0,...o,ref:n,children:c}):null});ti.displayName=ll;const Ra="SelectScrollUpButton",ni=h.forwardRef((e,n)=>{const a=pn(Ra,e.__scopeSelect),c=Za(Ra,e.__scopeSelect),[o,l]=h.useState(!1),u=et(n,c.onScrollButtonChange);return Rt(()=>{if(a.viewport&&a.isPositioned){const m=a.viewport,v=()=>{const R=m.scrollTop>0;l(R)};return v(),m.addEventListener("scroll",v),()=>m.removeEventListener("scroll",v)}},[a.viewport,a.isPositioned]),o?s.jsx(oi,{...e,ref:u,onAutoScroll:()=>{const{viewport:m,selectedItem:v}=a;m&&v&&(m.scrollTop-=v.offsetHeight)}}):null});ni.displayName=Ra;const _a="SelectScrollDownButton",ri=h.forwardRef((e,n)=>{const a=pn(_a,e.__scopeSelect),c=Za(_a,e.__scopeSelect),[o,l]=h.useState(!1),u=et(n,c.onScrollButtonChange);return Rt(()=>{if(a.viewport&&a.isPositioned){const m=a.viewport,v=()=>{const R=m.scrollHeight-m.clientHeight,C=Math.ceil(m.scrollTop)<R;l(C)};return v(),m.addEventListener("scroll",v),()=>m.removeEventListener("scroll",v)}},[a.viewport,a.isPositioned]),o?s.jsx(oi,{...e,ref:u,onAutoScroll:()=>{const{viewport:m,selectedItem:v}=a;m&&v&&(m.scrollTop+=v.offsetHeight)}}):null});ri.displayName=_a;const oi=h.forwardRef((e,n)=>{const{__scopeSelect:a,onAutoScroll:c,...o}=e,l=pn("SelectScrollButton",a),u=h.useRef(null),m=Vr(a),v=h.useCallback(()=>{u.current!==null&&(window.clearInterval(u.current),u.current=null)},[]);return h.useEffect(()=>()=>v(),[v]),Rt(()=>{m().find(C=>C.ref.current===document.activeElement)?.ref.current?.scrollIntoView({block:"nearest"})},[m]),s.jsx(Ke.div,{"aria-hidden":!0,...o,ref:n,style:{flexShrink:0,...o.style},onPointerMove:Oe(o.onPointerMove,()=>{l.onItemLeave?.(),u.current===null&&(u.current=window.setInterval(c,50))}),onPointerLeave:Oe(o.onPointerLeave,()=>{v()})})});oi.displayName="SelectScrollButtonImpl";const rw="SelectSeparator",ai=h.forwardRef((e,n)=>{const{__scopeSelect:a,...c}=e;return s.jsx(Ke.div,{"aria-hidden":!0,...c,ref:n})});ai.displayName=rw;const ja="SelectArrow",ii=h.forwardRef((e,n)=>{const{__scopeSelect:a,...c}=e,o=Oo(a),l=cn(ja,a),u=pn(ja,a);return l.open&&u.position==="popper"?s.jsx(k3,{...o,...c,ref:n}):null});ii.displayName=ja;const ow="BubbleSelect",aw=h.forwardRef((e,n)=>{const{value:a,...c}=e,o=h.useRef(null),l=et(n,o),u=U3(a),m=cn(ow,void 0);h.useEffect(()=>{const R=o.current,C=window.HTMLSelectElement.prototype,b=Object.getOwnPropertyDescriptor(C,"value").set;if(u!==a&&b){const A=new Event("change",{bubbles:!0});b.call(R,a),R.dispatchEvent(A)}},[u,a]);let v=a;return m.multi&&!Array.isArray(a)&&(v=[]),s.jsx(q3,{asChild:!0,children:s.jsx("select",{...c,multiple:m.multi?!0:void 0,ref:l,defaultValue:v})})});aw.displayName="BubbleSelect";function ul(e){const n=Wa(e),a=h.useRef(""),c=h.useRef(0),o=h.useCallback(u=>{const m=a.current+u;n(m),function v(R){a.current=R,window.clearTimeout(c.current),R!==""&&(c.current=window.setTimeout(()=>v(""),1e3))}(m)},[n]),l=h.useCallback(()=>{a.current="",window.clearTimeout(c.current)},[]);return h.useEffect(()=>()=>window.clearTimeout(c.current),[]),[a,o,l]}function dl(e,n,a){const o=n.length>1&&Array.from(n).every(R=>R===n[0])?n[0]:n,l=a?e.indexOf(a):-1;let u=iw(e,Math.max(l,0));o.length===1&&(u=u.filter(R=>R!==a));const v=u.find(R=>R.textValue.toLowerCase().startsWith(o.toLowerCase()));return v!==a?v:void 0}function iw(e,n){return e.map((a,c)=>e[(n+c)%e.length])}const hl=(e,n=[])=>{if(Array.isArray(e))return e.reduce((c,o)=>hl(o,c),n);const a=n.indexOf(e);return a===-1?[...n,e]:[...n.slice(0,a),...n.slice(a+1)]},sw=ka,cw=Ua,lw=qa,uw=Ga,dw=Ka,hw=Ya,fw=Xa,gw=Qa,ww=Ja,mw=Pa,xw=ei,vw=ti,pw=ni,bw=ri,$w=ai,Cw=ii,zt=Object.freeze(Object.defineProperty({__proto__:null,Arrow:Cw,Content:hw,Group:gw,Icon:uw,Item:mw,ItemIndicator:vw,ItemText:xw,Label:ww,Portal:dw,Root:sw,ScrollDownButton:bw,ScrollUpButton:pw,Select:ka,SelectArrow:ii,SelectContent:Ya,SelectGroup:Qa,SelectIcon:Ga,SelectItem:Pa,SelectItemIndicator:ti,SelectItemText:ei,SelectLabel:Ja,SelectPortal:Ka,SelectScrollDownButton:ri,SelectScrollUpButton:ni,SelectSeparator:ai,SelectTrigger:Ua,SelectValue:qa,SelectViewport:Xa,Separator:$w,Trigger:cw,Value:lw,Viewport:fw,createSelectScope:U4},Symbol.toStringTag,{value:"Module"}));function En(e,n,{checkForDefaultPrevented:a=!0}={}){return function(o){if(e?.(o),a===!1||!o.defaultPrevented)return n?.(o)}}const yw=({fill:e="currentColor",stroke:n,...a},c)=>{const{colors:o}=j(),l=e&&e in o?o[e]:e,u=n&&n in o?o[n]:n;return s.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 32 32",width:16,height:16,fill:l,stroke:u,ref:c,...a,children:s.jsx("path",{d:"M16 2A12.014 12.014 0 0 0 4 14c0 3 1.57 6.883 4.201 10.375C10.85 27.894 13.764 30 16 30s5.151-2.101 7.799-5.625C26.43 20.875 28 17 28 14A12.014 12.014 0 0 0 16 2M8 14.5A1.5 1.5 0 0 1 9.5 13a4.5 4.5 0 0 1 4.5 4.5 1.5 1.5 0 0 1-1.5 1.5A4.5 4.5 0 0 1 8 14.5M18 25h-4a1 1 0 0 1 0-2h4a1 1 0 0 1 0 2m1.5-6a1.5 1.5 0 0 1-1.5-1.5 4.5 4.5 0 0 1 4.5-4.5 1.5 1.5 0 0 1 1.5 1.5 4.5 4.5 0 0 1-4.5 4.5"})})};h.forwardRef(yw);const Sw=({fill:e="currentColor",stroke:n,...a},c)=>{const{colors:o}=j(),l=e&&e in o?o[e]:e,u=n&&n in o?o[n]:n;return s.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 32 32",width:16,height:16,fill:l,stroke:u,ref:c,...a,children:s.jsx("path",{d:"M28 6H4a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2v11a2 2 0 0 0 2 2h20a2 2 0 0 0 2-2V13a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2m-9 12h-6a1 1 0 0 1 0-2h6a1 1 0 0 1 0 2m9-7H4V8h24z"})})};h.forwardRef(Sw);const Rw=({fill:e="currentColor",stroke:n,...a},c)=>{const{colors:o}=j(),l=e&&e in o?o[e]:e,u=n&&n in o?o[n]:n;return s.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 32 32",width:16,height:16,fill:l,stroke:u,ref:c,...a,children:s.jsx("path",{d:"M30.5 7v6a1.5 1.5 0 0 1-1.5 1.5h-6a1.5 1.5 0 0 1 0-3h2.137l-2.375-2.173-.047-.046a9.5 9.5 0 1 0-6.84 16.219H16a9.44 9.44 0 0 0 6.519-2.59 1.5 1.5 0 1 1 2.061 2.181A12.43 12.43 0 0 1 16 28.5h-.171a12.5 12.5 0 1 1 8.985-21.368L27.5 9.59V7a1.5 1.5 0 0 1 3 0"})})},_w=h.forwardRef(Rw),Cb=_w,jw=({fill:e="currentColor",stroke:n,...a},c)=>{const{colors:o}=j(),l=e&&e in o?o[e]:e,u=n&&n in o?o[n]:n;return s.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 32 32",width:16,height:16,fill:l,stroke:u,ref:c,...a,children:s.jsx("path",{d:"m26.061 19.061-9 9a1.503 1.503 0 0 1-2.125 0l-9-9a1.503 1.503 0 1 1 2.125-2.125l6.439 6.439V5a1.5 1.5 0 1 1 3 0v18.375l6.439-6.44a1.502 1.502 0 1 1 2.125 2.125z"})})};h.forwardRef(jw);const Aw=({fill:e="currentColor",stroke:n,...a},c)=>{const{colors:o}=j(),l=e&&e in o?o[e]:e,u=n&&n in o?o[n]:n;return s.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 32 32",width:16,height:16,fill:l,stroke:u,ref:c,...a,children:s.jsx("path",{d:"M28.5 16a1.5 1.5 0 0 1-1.5 1.5H8.625l6.44 6.439a1.502 1.502 0 1 1-2.125 2.125l-9-9a1.5 1.5 0 0 1 0-2.125l9-9a1.503 1.503 0 0 1 2.125 2.125L8.625 14.5H27a1.5 1.5 0 0 1 1.5 1.5"})})},Iw=h.forwardRef(Aw),yb=Iw,Tw=({fill:e="currentColor",stroke:n,...a},c)=>{const{colors:o}=j(),l=e&&e in o?o[e]:e,u=n&&n in o?o[n]:n;return s.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 32 32",width:16,height:16,fill:l,stroke:u,ref:c,...a,children:s.jsx("path",{d:"m28.061 17.061-9 9a1.503 1.503 0 1 1-2.125-2.125l6.439-6.436H5a1.5 1.5 0 1 1 0-3h18.375l-6.436-6.44a1.503 1.503 0 0 1 2.125-2.125l9 9a1.5 1.5 0 0 1-.003 2.126"})})};h.forwardRef(Tw);const Mw=({fill:e="currentColor",stroke:n,...a},c)=>{const{colors:o}=j(),l=e&&e in o?o[e]:e,u=n&&n in o?o[n]:n;return s.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 32 32",width:16,height:16,fill:l,stroke:u,ref:c,...a,children:s.jsx("path",{d:"M26.061 15.061a1.5 1.5 0 0 1-2.125 0L17.5 8.625V27a1.5 1.5 0 1 1-3 0V8.625l-6.439 6.436a1.503 1.503 0 1 1-2.125-2.125l9-9a1.5 1.5 0 0 1 2.125 0l9 9a1.5 1.5 0 0 1 0 2.125"})})};h.forwardRef(Mw);const Ew=({fill:e="currentColor",stroke:n,...a},c)=>{const{colors:o}=j(),l=e&&e in o?o[e]:e,u=n&&n in o?o[n]:n;return s.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 32 32",width:16,height:16,fill:l,stroke:u,ref:c,...a,children:s.jsx("path",{d:"M11 13.5H5A1.5 1.5 0 0 1 3.5 12V6a1.5 1.5 0 0 1 3 0v1.733C8.581 5.683 11.786 3.5 16 3.5c5.558 0 8.92 3.299 9.061 3.439a1.5 1.5 0 0 1-2.117 2.125C22.889 9.01 20.25 6.5 16 6.5c-3.625 0-6.367 2.21-8 4h3a1.5 1.5 0 1 1 0 3m16 5h-6a1.5 1.5 0 1 0 0 3h3c-1.625 1.79-4.375 4-8 4-4.25 0-6.889-2.511-6.944-2.565A1.5 1.5 0 0 0 6.94 25.06c.141.141 3.504 3.44 9.061 3.44 4.214 0 7.419-2.183 9.5-4.233V26a1.5 1.5 0 1 0 3 0v-6a1.5 1.5 0 0 0-1.5-1.5"})})};h.forwardRef(Ew);const Lw=({fill:e="currentColor",stroke:n,...a},c)=>{const{colors:o}=j(),l=e&&e in o?o[e]:e,u=n&&n in o?o[n]:n;return s.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 32 32",width:16,height:16,fill:l,stroke:u,ref:c,...a,children:s.jsx("path",{d:"M27.725 21.993C27.031 20.798 26 17.416 26 13a10 10 0 0 0-20 0c0 4.418-1.032 7.797-1.726 8.993A2 2 0 0 0 6 25h5.101a5 5 0 0 0 9.798 0H26a2 2 0 0 0 1.725-3.008M16 27a3 3 0 0 1-2.828-2h5.656A3 3 0 0 1 16 27"})})};h.forwardRef(Lw);const Vw=({fill:e="currentColor",stroke:n,...a},c)=>{const{colors:o}=j(),l=e&&e in o?o[e]:e,u=n&&n in o?o[n]:n;return s.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 32 32",width:16,height:16,fill:l,stroke:u,ref:c,...a,children:s.jsx("path",{d:"M22.135 14.308A6.001 6.001 0 0 0 17.5 4.5H9A1.5 1.5 0 0 0 7.5 6v19A1.5 1.5 0 0 0 9 26.5h10a6.5 6.5 0 0 0 3.135-12.192M10.5 7.5h7a3 3 0 0 1 0 6h-7zm8.5 16h-8.5v-7H19a3.5 3.5 0 1 1 0 7"})})};h.forwardRef(Vw);const Bw=({fill:e="currentColor",stroke:n,...a},c)=>{const{colors:o}=j(),l=e&&e in o?o[e]:e,u=n&&n in o?o[n]:n;return s.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 32 32",width:16,height:16,fill:l,stroke:u,ref:c,...a,children:s.jsx("path",{d:"M27 4v20a1 1 0 0 1-1 1H9a2 2 0 0 0-2 2h17a1 1 0 0 1 0 2H6a1 1 0 0 1-1-1V7a4 4 0 0 1 4-4h17a1 1 0 0 1 1 1"})})};h.forwardRef(Bw);const Dw=({fill:e="currentColor",stroke:n,...a},c)=>{const{colors:o}=j(),l=e&&e in o?o[e]:e,u=n&&n in o?o[n]:n;return s.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 32 32",width:16,height:16,fill:l,stroke:u,ref:c,...a,children:s.jsx("path",{d:"M19 14a1 1 0 0 1-1 1h-4a1 1 0 0 1 0-2h4a1 1 0 0 1 1 1m10-5v16a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h5V6a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3v1h5a2 2 0 0 1 2 2M12 7h8V6a1 1 0 0 0-1-1h-6a1 1 0 0 0-1 1zm15 7.201V9H5v5.201A23 23 0 0 0 16 17a23 23 0 0 0 11-2.799"})})};h.forwardRef(Dw);const Ow=({fill:e="currentColor",stroke:n,...a},c)=>{const{colors:o}=j(),l=e&&e in o?o[e]:e,u=n&&n in o?o[n]:n;return s.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 32 32",width:16,height:16,fill:l,stroke:u,ref:c,...a,children:s.jsx("path",{d:"M9.5 8A1.5 1.5 0 0 1 11 6.5h16a1.5 1.5 0 0 1 0 3H11A1.5 1.5 0 0 1 9.5 8M27 14.5H11a1.5 1.5 0 1 0 0 3h16a1.5 1.5 0 1 0 0-3m0 8H11a1.5 1.5 0 1 0 0 3h16a1.5 1.5 0 1 0 0-3M5.5 14a2 2 0 1 0 0 4 2 2 0 0 0 0-4m0-8a2 2 0 1 0 0 4 2 2 0 0 0 0-4m0 16a2 2 0 1 0 0 4 2 2 0 0 0 0-4"})})};h.forwardRef(Ow);const Hw=({fill:e="currentColor",stroke:n,...a},c)=>{const{colors:o}=j(),l=e&&e in o?o[e]:e,u=n&&n in o?o[n]:n;return s.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 32 32",width:16,height:16,fill:l,stroke:u,ref:c,...a,children:s.jsx("path",{d:"M26 4h-3V3a1 1 0 0 0-2 0v1H11V3a1 1 0 0 0-2 0v1H6a2 2 0 0 0-2 2v20a2 2 0 0 0 2 2h20a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2m0 6H6V6h3v1a1 1 0 0 0 2 0V6h10v1a1 1 0 0 0 2 0V6h3z"})})},Nw=h.forwardRef(Hw),Fw=Nw,zw=({fill:e="currentColor",stroke:n,...a},c)=>{const{colors:o}=j(),l=e&&e in o?o[e]:e,u=n&&n in o?o[n]:n;return s.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 32 32",width:16,height:16,fill:l,stroke:u,ref:c,...a,children:s.jsx("path",{d:"M30 14h-1.35l-3.472-7.812A2 2 0 0 0 23.35 5H8.65a2 2 0 0 0-1.828 1.188L3.35 14H2a1 1 0 0 0 0 2h1v10a2 2 0 0 0 2 2h3a2 2 0 0 0 2-2v-2h12v2a2 2 0 0 0 2 2h3a2 2 0 0 0 2-2V16h1a1 1 0 0 0 0-2m-20 6H8a1 1 0 0 1 0-2h2a1 1 0 0 1 0 2m12 0a1 1 0 0 1 0-2h2a1 1 0 0 1 0 2z"})})};h.forwardRef(zw);const Ww=({fill:e="currentColor",stroke:n,...a},c)=>{const{colors:o}=j(),l=e&&e in o?o[e]:e,u=n&&n in o?o[n]:n;return s.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 32 32",width:16,height:16,fill:l,stroke:u,ref:c,...a,children:s.jsx("path",{d:"m26.708 12.708-10 10a1 1 0 0 1-1.415 0l-10-10A1 1 0 0 1 6 11h20a1 1 0 0 1 .707 1.707"})})},kw=h.forwardRef(Ww),Vn=kw,Uw=({fill:e="currentColor",stroke:n,...a},c)=>{const{colors:o}=j(),l=e&&e in o?o[e]:e,u=n&&n in o?o[n]:n;return s.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 32 32",width:16,height:16,fill:l,stroke:u,ref:c,...a,children:s.jsx("path",{d:"M26.924 20.383A1 1 0 0 1 26 21H6a1 1 0 0 1-.708-1.707l10-10a1 1 0 0 1 1.415 0l10 10a1 1 0 0 1 .217 1.09"})})};h.forwardRef(Uw);const qw=({fill:e="currentColor",stroke:n,...a},c)=>{const{colors:o}=j(),l=e&&e in o?o[e]:e,u=n&&n in o?o[n]:n;return s.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 32 32",width:16,height:16,fill:l,stroke:u,ref:c,...a,children:s.jsx("path",{d:"M7 26a1 1 0 1 1-2 0 1 1 0 0 0-1-1 1 1 0 0 1 0-2 3 3 0 0 1 3 3m-3-7a1 1 0 0 0 0 2 5 5 0 0 1 5 5 1 1 0 1 0 2 0 7.01 7.01 0 0 0-7-7m0-4a1 1 0 0 0 0 2 9.01 9.01 0 0 1 9 9 1 1 0 0 0 2 0A11.01 11.01 0 0 0 4 15M27 5H5a2 2 0 0 0-2 2v5a1 1 0 0 0 1 1 13.014 13.014 0 0 1 13 13 1 1 0 0 0 1 1h9a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2"})})};h.forwardRef(qw);const Gw=({fill:e="currentColor",stroke:n,...a},c)=>{const{colors:o}=j(),l=e&&e in o?o[e]:e,u=n&&n in o?o[n]:n;return s.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 32 32",width:16,height:16,fill:l,stroke:u,ref:c,...a,children:s.jsx("path",{d:"M25 3h-1a2 2 0 0 0-2 2v2h-3.5V5a2 2 0 0 0-2-2h-1a2 2 0 0 0-2 2v2H10V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v5.586A1.98 1.98 0 0 0 5.586 12L7 13.414V27a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V13.414L26.414 12A1.98 1.98 0 0 0 27 10.586V5a2 2 0 0 0-2-2m-6 24h-6v-8a3 3 0 0 1 6 0z"})})};h.forwardRef(Gw);const Kw=({fill:e="currentColor",stroke:n,...a},c)=>{const{colors:o}=j(),l=e&&e in o?o[e]:e,u=n&&n in o?o[n]:n;return s.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 32 32",width:16,height:16,fill:l,stroke:u,ref:c,...a,children:s.jsx("path",{d:"M27 5H5a2 2 0 0 0-2 2v18a2 2 0 0 0 2 2h22a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2m-3.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3m0 7a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3m-5-2a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3m-3-5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3m-3 7a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3M25 24H7a1 1 0 0 1-1-1V9a1 1 0 0 1 2 0v13h17a1 1 0 0 1 0 2"})})};h.forwardRef(Kw);const Yw=({fill:e="currentColor",stroke:n,...a},c)=>{const{colors:o}=j(),l=e&&e in o?o[e]:e,u=n&&n in o?o[n]:n;return s.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 32 32",width:16,height:16,fill:l,stroke:u,ref:c,...a,children:s.jsx("path",{d:"M3.094 14.443a12.8 12.8 0 0 1 2.914-6.72 2 2 0 0 1 2.953-.138l3.459 3.533a1.98 1.98 0 0 1 .211 2.56 3.2 3.2 0 0 0-.462.968.5.5 0 0 1-.478.354h-8.1a.5.5 0 0 1-.497-.557m14.08-11.435A2 2 0 0 0 15 5v5.084a1.98 1.98 0 0 0 1.656 1.97 4 4 0 0 1 .677 7.72.51.51 0 0 0-.333.476v8.154a.5.5 0 0 0 .558.5A13.04 13.04 0 0 0 29 16.185C29.094 9.4 23.899 3.61 17.174 3.008M14.656 19.77a4 4 0 0 1-2.425-2.427.51.51 0 0 0-.475-.343H3.59a.5.5 0 0 0-.5.556A13.01 13.01 0 0 0 14.443 28.91a.5.5 0 0 0 .556-.5V20.25a.51.51 0 0 0-.343-.48"})})};h.forwardRef(Yw);const Zw=({fill:e="currentColor",stroke:n,...a},c)=>{const{colors:o}=j(),l=e&&e in o?o[e]:e,u=n&&n in o?o[n]:n;return s.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 32 32",width:16,height:16,fill:l,stroke:u,ref:c,...a,children:s.jsx("path",{d:"M16 3a13 13 0 1 0 13 13A13.013 13.013 0 0 0 16 3m0 2a11 11 0 0 1 8.984 4.659L16 14.845zm0 22a11 11 0 0 1-8.984-4.659l18.97-10.951A11 11 0 0 1 16 27"})})};h.forwardRef(Zw);const Xw=({fill:e="currentColor",stroke:n,...a},c)=>{const{colors:o}=j(),l=e&&e in o?o[e]:e,u=n&&n in o?o[n]:n;return s.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 32 32",width:16,height:16,fill:l,stroke:u,ref:c,...a,children:s.jsx("path",{d:"m29.061 10.061-16 16a1.5 1.5 0 0 1-2.125 0l-7-7a1.504 1.504 0 0 1 2.125-2.125L12 22.875 26.939 7.939a1.502 1.502 0 1 1 2.125 2.125z"})})},Qw=h.forwardRef(Xw),Sb=Qw,Jw=({fill:e="currentColor",stroke:n,...a},c)=>{const{colors:o}=j(),l=e&&e in o?o[e]:e,u=n&&n in o?o[n]:n;return s.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 32 32",width:16,height:16,fill:l,stroke:u,ref:c,...a,children:s.jsx("path",{d:"M16 3a13 13 0 1 0 13 13A13.013 13.013 0 0 0 16 3m5.708 10.708-7 7a1 1 0 0 1-1.415 0l-3-3a1 1 0 0 1 1.415-1.415L14 18.586l6.293-6.293a1 1 0 0 1 1.415 1.415"})})},Pw=h.forwardRef(Jw),em=Pw,tm=({fill:e="currentColor",stroke:n,...a},c)=>{const{colors:o}=j(),l=e&&e in o?o[e]:e,u=n&&n in o?o[n]:n;return s.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 32 32",width:16,height:16,fill:l,stroke:u,ref:c,...a,children:s.jsx("path",{d:"m27.061 13.061-10 10a1.503 1.503 0 0 1-2.125 0l-10-10a1.503 1.503 0 1 1 2.125-2.125L16 19.875l8.939-8.94a1.502 1.502 0 1 1 2.125 2.125z"})})};h.forwardRef(tm);const nm=({fill:e="currentColor",stroke:n,...a},c)=>{const{colors:o}=j(),l=e&&e in o?o[e]:e,u=n&&n in o?o[n]:n;return s.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 32 32",width:16,height:16,fill:l,stroke:u,ref:c,...a,children:s.jsx("path",{d:"M21.061 24.939a1.503 1.503 0 0 1-2.125 2.125l-10-10a1.5 1.5 0 0 1 0-2.125l10-10a1.503 1.503 0 0 1 2.125 2.125L12.125 16z"})})},rm=h.forwardRef(nm),fl=rm,om=({fill:e="currentColor",stroke:n,...a},c)=>{const{colors:o}=j(),l=e&&e in o?o[e]:e,u=n&&n in o?o[n]:n;return s.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 32 32",width:16,height:16,fill:l,stroke:u,ref:c,...a,children:s.jsx("path",{d:"m23.061 17.061-10 10a1.503 1.503 0 0 1-2.125-2.125L19.875 16l-8.936-8.939a1.502 1.502 0 1 1 2.125-2.125l10 10a1.5 1.5 0 0 1-.003 2.125"})})},am=h.forwardRef(om),si=am,im=({fill:e="currentColor",stroke:n,...a},c)=>{const{colors:o}=j(),l=e&&e in o?o[e]:e,u=n&&n in o?o[n]:n;return s.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 32 32",width:16,height:16,fill:l,stroke:u,ref:c,...a,children:s.jsx("path",{d:"M27.061 21.061a1.503 1.503 0 0 1-2.125 0L16 12.125l-8.939 8.936a1.503 1.503 0 0 1-2.125-2.125l10-10a1.5 1.5 0 0 1 2.125 0l10 10a1.5 1.5 0 0 1 0 2.125"})})};h.forwardRef(im);const sm=({fill:e="currentColor",stroke:n,...a},c)=>{const{colors:o}=j(),l=e&&e in o?o[e]:e,u=n&&n in o?o[n]:n;return s.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 32 32",width:16,height:16,fill:l,stroke:u,ref:c,...a,children:s.jsx("path",{d:"M16 3a13 13 0 1 0 13 13A13.013 13.013 0 0 0 16 3m7 14h-7a1 1 0 0 1-1-1V9a1 1 0 0 1 2 0v6h6a1 1 0 0 1 0 2"})})},cm=h.forwardRef(sm),lm=cm,um=({fill:e="currentColor",stroke:n,...a},c)=>{const{colors:o}=j(),l=e&&e in o?o[e]:e,u=n&&n in o?o[n]:n;return s.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 32 32",width:16,height:16,fill:l,stroke:u,ref:c,...a,children:s.jsx("path",{d:"M28 16a12 12 0 0 1-20.236 8.728 1.002 1.002 0 0 1 1.375-1.456 10 10 0 1 0-.21-14.343c-.441.446-.857.885-1.26 1.321l2.039 2.043A1 1 0 0 1 9 14H4a1 1 0 0 1-1-1V8a1 1 0 0 1 1.707-.707L6.25 8.838c.402-.437.817-.875 1.258-1.32A12 12 0 0 1 28 16M16 9a1 1 0 0 0-1 1v6a1 1 0 0 0 .485.858l5 3a.999.999 0 0 0 1.486-1.1 1 1 0 0 0-.456-.616L17 15.434V10a1 1 0 0 0-1-1"})})};h.forwardRef(um);const dm=({fill:e="currentColor",stroke:n,...a},c)=>{const{colors:o}=j(),l=e&&e in o?o[e]:e,u=n&&n in o?o[n]:n;return s.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 32 32",width:16,height:16,fill:l,stroke:u,ref:c,...a,children:s.jsx("path",{d:"M20.008 5a11.01 11.01 0 0 0-9.847 6.084A10.9 10.9 0 0 0 9 15.966 1.023 1.023 0 0 1 8.071 17 1 1 0 0 1 7 16a13 13 0 0 1 .668-4.115.5.5 0 0 0-.594-.647A8.01 8.01 0 0 0 1 19c0 4.399 3.719 8 8.125 8H20a11.01 11.01 0 0 0 10.991-11.435C30.764 9.693 25.884 5 20.008 5"})})};h.forwardRef(dm);const hm=({fill:e="currentColor",stroke:n,...a},c)=>{const{colors:o}=j(),l=e&&e in o?o[e]:e,u=n&&n in o?o[n]:n;return s.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 32 32",width:16,height:16,fill:l,stroke:u,ref:c,...a,children:s.jsx("path",{d:"M30.991 15.565C30.764 9.693 25.884 5 20.008 5a11.01 11.01 0 0 0-9.847 6.084A10.9 10.9 0 0 0 9 15.966 1.023 1.023 0 0 1 8.071 17 1 1 0 0 1 7 16a13 13 0 0 1 .668-4.115.5.5 0 0 0-.594-.647A8.01 8.01 0 0 0 1 19c0 4.399 3.719 8 8.125 8H20a11.01 11.01 0 0 0 10.991-11.435m-7.283 3.143a1 1 0 0 1-1.415 0L20 16.414V24a1 1 0 0 1-2 0v-7.586l-2.293 2.293a1 1 0 0 1-1.415-1.415l4-4a1 1 0 0 1 1.415 0l4 4a1 1 0 0 1 0 1.415"})})};h.forwardRef(hm);const fm=({fill:e="currentColor",stroke:n,...a},c)=>{const{colors:o}=j(),l=e&&e in o?o[e]:e,u=n&&n in o?o[n]:n;return s.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 32 32",width:16,height:16,fill:l,stroke:u,ref:c,...a,children:s.jsx("path",{d:"M8.96 12.153 4.342 16l4.618 3.848a1.5 1.5 0 1 1-1.92 2.305l-6-5a1.5 1.5 0 0 1 0-2.305l6-5a1.5 1.5 0 0 1 1.92 2.304m22 2.694-6-5a1.5 1.5 0 1 0-1.92 2.306L27.658 16l-4.618 3.848a1.5 1.5 0 1 0 1.92 2.305l6-5a1.5 1.5 0 0 0 0-2.305M20.512 3.59a1.5 1.5 0 0 0-1.922.898l-8 22a1.5 1.5 0 0 0 2.82 1.024l8-22a1.5 1.5 0 0 0-.898-1.922"})})};h.forwardRef(fm);const gm=({fill:e="currentColor",stroke:n,...a},c)=>{const{colors:o}=j(),l=e&&e in o?o[e]:e,u=n&&n in o?o[n]:n;return s.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 32 32",width:16,height:16,fill:l,stroke:u,ref:c,...a,children:s.jsx("path",{d:"M26 10H4a1 1 0 0 0-1 1v6a12.04 12.04 0 0 0 4.068 9H4a1 1 0 0 0 0 2h22a1 1 0 0 0 0-2h-3.067a12.1 12.1 0 0 0 3.375-5.011A5 5 0 0 0 31 16v-1a5 5 0 0 0-5-5m3 6a3 3 0 0 1-2.15 2.875Q27 17.944 27 17v-4.828A3 3 0 0 1 29 15zM14 7V3a1 1 0 0 1 2 0v4a1 1 0 0 1-2 0m4 0V3a1 1 0 0 1 2 0v4a1 1 0 0 1-2 0m-8 0V3a1 1 0 0 1 2 0v4a1 1 0 0 1-2 0"})})};h.forwardRef(gm);const wm=({fill:e="currentColor",stroke:n,...a},c)=>{const{colors:o}=j(),l=e&&e in o?o[e]:e,u=n&&n in o?o[n]:n;return s.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 32 32",width:16,height:16,fill:l,stroke:u,ref:c,...a,children:s.jsx("path",{d:"M29.743 13.401a1 1 0 0 0-.487-.675l-3.729-2.125-.015-4.202a1 1 0 0 0-.353-.76 14 14 0 0 0-4.59-2.584 1 1 0 0 0-.808.074L16 5.23l-3.765-2.106a1 1 0 0 0-.809-.075 14 14 0 0 0-4.585 2.594 1 1 0 0 0-.354.758L6.47 10.61 2.74 12.734a1 1 0 0 0-.486.675 13.3 13.3 0 0 0 0 5.195 1 1 0 0 0 .486.675l3.729 2.125.015 4.204a1 1 0 0 0 .353.76 14 14 0 0 0 4.59 2.583 1 1 0 0 0 .808-.073L16 26.768l3.765 2.107a1.013 1.013 0 0 0 .809.073 14 14 0 0 0 4.585-2.592 1 1 0 0 0 .354-.759l.018-4.206 3.729-2.125a1 1 0 0 0 .486-.675c.34-1.713.338-3.477-.003-5.19M16 21a5 5 0 1 1 0-10 5 5 0 0 1 0 10"})})},mm=h.forwardRef(wm),Rb=mm,xm=({fill:e="currentColor",stroke:n,...a},c)=>{const{colors:o}=j(),l=e&&e in o?o[e]:e,u=n&&n in o?o[n]:n;return s.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 32 32",width:16,height:16,fill:l,stroke:u,ref:c,...a,children:s.jsx("path",{d:"M18.5 12V6a1.5 1.5 0 1 1 3 0v4.5H26a1.5 1.5 0 1 1 0 3h-6a1.5 1.5 0 0 1-1.5-1.5M12 18.5H6a1.5 1.5 0 1 0 0 3h4.5V26a1.5 1.5 0 1 0 3 0v-6a1.5 1.5 0 0 0-1.5-1.5m14 0h-6a1.5 1.5 0 0 0-1.5 1.5v6a1.5 1.5 0 1 0 3 0v-4.5H26a1.5 1.5 0 1 0 0-3m-14-14A1.5 1.5 0 0 0 10.5 6v4.5H6a1.5 1.5 0 1 0 0 3h6a1.5 1.5 0 0 0 1.5-1.5V6A1.5 1.5 0 0 0 12 4.5"})})};h.forwardRef(xm);const vm=({fill:e="currentColor",stroke:n,...a},c)=>{const{colors:o}=j(),l=e&&e in o?o[e]:e,u=n&&n in o?o[n]:n;return s.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 32 32",width:16,height:16,fill:l,stroke:u,ref:c,...a,children:s.jsx("path",{d:"M22.5 17.5h-2v-3h2a5 5 0 1 0-5-5v2h-3v-2a5 5 0 1 0-5 5h2v3h-2a5 5 0 1 0 5 5v-2h3v2a5 5 0 1 0 5-5m-2-8a2 2 0 1 1 2 2h-2zm-13 0a2 2 0 0 1 4 0v2h-2a2 2 0 0 1-2-2m4 13a2 2 0 1 1-2-2h2zm3-8h3v3h-3zm8 10a2 2 0 0 1-2-2v-2h2a2 2 0 0 1 0 4"})})};h.forwardRef(vm);const pm=({fill:e="currentColor",stroke:n,...a},c)=>{const{colors:o}=j(),l=e&&e in o?o[e]:e,u=n&&n in o?o[n]:n;return s.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 32 32",width:16,height:16,fill:l,stroke:u,ref:c,...a,children:s.jsx("path",{d:"M30.5 24a1.5 1.5 0 0 1-1.5 1.5h-3.5V29a1.5 1.5 0 1 1-3 0v-3.5H8A1.5 1.5 0 0 1 6.5 24V9.5H3a1.5 1.5 0 0 1 0-3h3.5V3a1.5 1.5 0 0 1 3 0v19.5H29a1.5 1.5 0 0 1 1.5 1.5M13 9.5h9.5V19a1.5 1.5 0 1 0 3 0V8A1.5 1.5 0 0 0 24 6.5H13a1.5 1.5 0 0 0 0 3"})})};h.forwardRef(pm);const bm=({fill:e="currentColor",stroke:n,...a},c)=>{const{colors:o}=j(),l=e&&e in o?o[e]:e,u=n&&n in o?o[n]:n;return s.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 32 32",width:16,height:16,fill:l,stroke:u,ref:c,...a,children:s.jsx("path",{d:"M26.061 23.939a1.503 1.503 0 0 1-2.125 2.125L16 18.125l-7.939 7.936a1.503 1.503 0 1 1-2.125-2.125L13.875 16 5.939 8.061a1.503 1.503 0 1 1 2.125-2.125L16 13.875l7.939-7.94a1.502 1.502 0 1 1 2.125 2.125L18.125 16z"})})},$m=h.forwardRef(bm),On=$m,Cm=({fill:e="currentColor",stroke:n,...a},c)=>{const{colors:o}=j(),l=e&&e in o?o[e]:e,u=n&&n in o?o[n]:n;return s.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 32 32",width:16,height:16,fill:l,stroke:u,ref:c,...a,children:s.jsx("path",{d:"M16 3a13 13 0 1 0 13 13A13.013 13.013 0 0 0 16 3m4.708 16.293a1 1 0 0 1-1.415 1.415L16 17.414l-3.293 3.293a1 1 0 0 1-1.415-1.415L14.587 16l-3.293-3.293a1 1 0 1 1 1.415-1.415L16 14.587l3.293-3.293a1 1 0 0 1 1.415 1.415L17.414 16z"})})};h.forwardRef(Cm);const ym=({fill:e="currentColor",stroke:n,...a},c)=>{const{colors:o}=j(),l=e&&e in o?o[e]:e,u=n&&n in o?o[n]:n;return s.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 32 32",width:16,height:16,fill:l,stroke:u,ref:c,...a,children:s.jsx("path",{d:"M30.48 9.524a1.51 1.51 0 0 0-1.668-.213l-6.276 3.125-5.24-8.704a1.514 1.514 0 0 0-2.592 0l-5.24 8.708L3.19 9.315a1.514 1.514 0 0 0-2.113 1.825l4.625 14.17a1 1 0 0 0 1.46.55C7.194 25.841 10.39 24 16 24s8.806 1.841 8.835 1.859a1 1 0 0 0 1.464-.549l4.625-14.166a1.51 1.51 0 0 0-.444-1.62M21.98 19.6a1 1 0 0 1-1.159.811 28.5 28.5 0 0 0-9.652 0 1 1 0 0 1-.348-1.97 30.6 30.6 0 0 1 10.348 0 1 1 0 0 1 .816 1.159z"})})};h.forwardRef(ym);const Sm=({fill:e="currentColor",stroke:n,...a},c)=>{const{colors:o}=j(),l=e&&e in o?o[e]:e,u=n&&n in o?o[n]:n;return s.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 32 32",width:16,height:16,fill:l,stroke:u,ref:c,...a,children:s.jsx("path",{d:"M27.414 24a2 2 0 0 1 0 2.829l-.585.585a2 2 0 0 1-2.829 0l-6.906-6.905-2.735 6.292A1.98 1.98 0 0 1 12.533 28h-.098a1.98 1.98 0 0 1-1.801-1.375L4.1 6.615A1.994 1.994 0 0 1 6.615 4.1l20.01 6.534a2 2 0 0 1 .176 3.725l-6.292 2.735z"})})};h.forwardRef(Sm);const Rm=({fill:e="currentColor",stroke:n,...a},c)=>{const{colors:o}=j(),l=e&&e in o?o[e]:e,u=n&&n in o?o[n]:n;return s.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 32 32",width:16,height:16,fill:l,stroke:u,ref:c,...a,children:s.jsx("path",{d:"M16 3C9.271 3 4 6.075 4 10v12c0 3.925 5.271 7 12 7s12-3.075 12-7V10c0-3.925-5.271-7-12-7m10 13c0 1.203-.985 2.429-2.701 3.365C21.366 20.419 18.774 21 16 21s-5.366-.581-7.299-1.635C6.985 18.429 6 17.203 6 16v-2.08C8.133 15.795 11.779 17 16 17s7.868-1.21 10-3.08zm-2.701 9.365C21.366 26.419 18.774 27 16 27s-5.366-.581-7.299-1.635C6.985 24.429 6 23.203 6 22v-2.08C8.133 21.795 11.779 23 16 23s7.868-1.21 10-3.08V22c0 1.203-.985 2.429-2.701 3.365"})})};h.forwardRef(Rm);const _m=({fill:e="currentColor",stroke:n,...a},c)=>{const{colors:o}=j(),l=e&&e in o?o[e]:e,u=n&&n in o?o[n]:n;return s.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 32 32",width:16,height:16,fill:l,stroke:u,ref:c,...a,children:s.jsx("path",{d:"M29 12a2 2 0 0 0-2-2h-4V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v16a1 1 0 0 0 1.625.777L9 19.25V23a2 2 0 0 0 2 2h11.699l4.676 3.778A1 1 0 0 0 29 28zm-5.319 11.223a1 1 0 0 0-.625-.223H11v-4h10a2 2 0 0 0 2-2v-5h4v13.906z"})})};h.forwardRef(_m);const jm=({fill:e="currentColor",stroke:n,...a},c)=>{const{colors:o}=j(),l=e&&e in o?o[e]:e,u=n&&n in o?o[n]:n;return s.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 32 32",width:16,height:16,fill:l,stroke:u,ref:c,...a,children:s.jsx("path",{d:"M28.5 19v7a2.5 2.5 0 0 1-2.5 2.5H6A2.5 2.5 0 0 1 3.5 26v-7a1.5 1.5 0 0 1 3 0v6.5h19V19a1.5 1.5 0 1 1 3 0m-13.561 1.061a1.5 1.5 0 0 0 2.125 0l5-5a1.502 1.502 0 1 0-2.125-2.125L17.5 15.375V5a1.5 1.5 0 1 0-3 0v10.375l-2.439-2.436a1.502 1.502 0 1 0-2.125 2.125z"})})};h.forwardRef(jm);const Am=({fill:e="currentColor",stroke:n,...a},c)=>{const{colors:o}=j(),l=e&&e in o?o[e]:e,u=n&&n in o?o[n]:n;return s.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 32 32",width:16,height:16,fill:l,stroke:u,ref:c,...a,children:s.jsx("path",{d:"M13.5 7.5a2 2 0 1 1-4 0 2 2 0 0 1 4 0m7 2a2 2 0 1 0 0-4 2 2 0 0 0 0 4m-9 4.5a2 2 0 1 0 0 4 2 2 0 0 0 0-4m9 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-9 8.5a2 2 0 1 0 0 4 2 2 0 0 0 0-4m9 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4"})})};h.forwardRef(Am);const Im=({fill:e="currentColor",stroke:n,...a},c)=>{const{colors:o}=j(),l=e&&e in o?o[e]:e,u=n&&n in o?o[n]:n;return s.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 32 32",width:16,height:16,fill:l,stroke:u,ref:c,...a,children:s.jsx("path",{d:"M27 4H11a1 1 0 0 0-1 1v5H5a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1v-5h5a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1m-1 16h-4v-9a1 1 0 0 0-1-1h-9V6h14z"})})};h.forwardRef(Im);const Tm=({fill:e="currentColor",stroke:n,...a},c)=>{const{colors:o}=j(),l=e&&e in o?o[e]:e,u=n&&n in o?o[n]:n;return s.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 32 32",width:16,height:16,fill:l,stroke:u,ref:c,...a,children:s.jsx("path",{d:"M16 3a13 13 0 1 0 13 13A13.013 13.013 0 0 0 16 3m11 13c.001 1.411-.27 2.81-.8 4.118l-5.587-3.437a2 2 0 0 0-.78-.279l-2.853-.385a2.01 2.01 0 0 0-2 .983h-1.09l-.475-.983a1.99 1.99 0 0 0-1.375-1.083l-1-.216.978-1.718h2.088c.338 0 .67-.087.966-.25l1.532-.845q.202-.113.375-.268l3.364-3.042a1.99 1.99 0 0 0 .407-2.458l-.045-.08A11.01 11.01 0 0 1 27 16M5 16a10.94 10.94 0 0 1 1.068-4.725l1.417 3.784a2 2 0 0 0 1.453 1.25l2.678.576.476.99a2.01 2.01 0 0 0 1.8 1.125h.186l-.904 2.029a2 2 0 0 0 .357 2.171l.018.018L16 25.742l-.242 1.25A11.014 11.014 0 0 1 5 16"})})};h.forwardRef(Tm);const Mm=({fill:e="currentColor",stroke:n,...a},c)=>{const{colors:o}=j(),l=e&&e in o?o[e]:e,u=n&&n in o?o[n]:n;return s.jsxs("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 32 32",width:16,height:16,fill:l,stroke:u,ref:c,...a,children:[s.jsx("path",{d:"M20.689 3.88A13 13 0 0 0 16 3a13 13 0 0 0-8.155 23.124l1.02-1.765A11 11 0 0 1 5 16a10.94 10.94 0 0 1 1.068-4.724l1.417 3.784a2 2 0 0 0 1.453 1.25l2.678.576.476.99q.113.226.275.418l1.169-2.025-.121-.25a1.99 1.99 0 0 0-1.375-1.084l-1-.217.978-1.717h2.088c.338 0 .67-.087.966-.25l.726-.4z"}),s.jsx("path",{fillRule:"evenodd",d:"m24 2.144 1.732 1-1.58 2.736q.54.435 1.036.932A13.01 13.01 0 0 1 29 16a13 13 0 0 1-17.69 12.124l-1.578 2.732-1.732-1zm-.86 5.49-4.936 8.549 1.628.22c.277.037.543.132.78.278l5.588 3.436c.53-1.308.801-2.706.8-4.117a11.01 11.01 0 0 0-3.86-8.367M13.92 23.6l-1.593 2.76a11 11 0 0 0 3.43.631l.242-1.25z",clipRule:"evenodd"})]})};h.forwardRef(Mm);const Em=({fill:e="currentColor",stroke:n,...a},c)=>{const{colors:o}=j(),l=e&&e in o?o[e]:e,u=n&&n in o?o[n]:n;return s.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 32 32",width:16,height:16,fill:l,stroke:u,ref:c,...a,children:s.jsx("path",{d:"M16 3a13 13 0 1 0 13 13A13.013 13.013 0 0 0 16 3m-4.5 9a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3m10.365 7.5C20.579 21.724 18.441 23 16 23s-4.579-1.275-5.865-3.5a1.001 1.001 0 0 1 1.477-1.31q.157.129.253.31C12.799 20.114 14.266 21 16 21s3.201-.887 4.135-2.5a1 1 0 1 1 1.73 1M20.5 15a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3"})})};h.forwardRef(Em);const Lm=({fill:e="currentColor",stroke:n,...a},c)=>{const{colors:o}=j(),l=e&&e in o?o[e]:e,u=n&&n in o?o[n]:n;return s.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 32 32",width:16,height:16,fill:l,stroke:u,ref:c,...a,children:s.jsx("path",{d:"M16 3a13 13 0 1 0 13 13A13.013 13.013 0 0 0 16 3m-4.5 9a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3m10 10.865a1 1 0 0 1-1.365-.365C19.201 20.886 17.734 20 16 20s-3.201.887-4.135 2.5a1.001 1.001 0 1 1-1.73-1C11.421 19.276 13.559 18 16 18s4.579 1.275 5.865 3.5a1 1 0 0 1-.365 1.365M20.5 15a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3"})})};h.forwardRef(Lm);const Vm=({fill:e="currentColor",stroke:n,...a},c)=>{const{colors:o}=j(),l=e&&e in o?o[e]:e,u=n&&n in o?o[n]:n;return s.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 32 32",width:16,height:16,fill:l,stroke:u,ref:c,...a,children:s.jsx("path",{d:"M27.5 6v5a1.5 1.5 0 1 1-3 0V7.5H21a1.5 1.5 0 0 1 0-3h5A1.5 1.5 0 0 1 27.5 6M11 24.5H7.5V21a1.5 1.5 0 0 0-3 0v5A1.5 1.5 0 0 0 6 27.5h5a1.5 1.5 0 1 0 0-3m15-5a1.5 1.5 0 0 0-1.5 1.5v3.5H21a1.5 1.5 0 1 0 0 3h5a1.5 1.5 0 0 0 1.5-1.5v-5a1.5 1.5 0 0 0-1.5-1.5m-15-15H6A1.5 1.5 0 0 0 4.5 6v5a1.5 1.5 0 0 0 3 0V7.5H11a1.5 1.5 0 0 0 0-3"})})};h.forwardRef(Vm);const Bm=({fill:e="currentColor",stroke:n,...a},c)=>{const{colors:o}=j(),l=e&&e in o?o[e]:e,u=n&&n in o?o[n]:n;return s.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 32 32",width:16,height:16,fill:l,stroke:u,ref:c,...a,children:s.jsx("path",{d:"M28.5 13a1.5 1.5 0 1 1-3 0V8.625l-7.439 7.439a1.503 1.503 0 1 1-2.125-2.125L23.375 6.5H19a1.5 1.5 0 0 1 0-3h8A1.5 1.5 0 0 1 28.5 5zM23 16a1.5 1.5 0 0 0-1.5 1.5v8h-15v-15h8a1.5 1.5 0 1 0 0-3H6A2.5 2.5 0 0 0 3.5 10v16A2.5 2.5 0 0 0 6 28.5h16a2.5 2.5 0 0 0 2.5-2.5v-8.5A1.5 1.5 0 0 0 23 16"})})},Dm=h.forwardRef(Bm),Om=Dm,Hm=({fill:e="currentColor",stroke:n,...a},c)=>{const{colors:o}=j(),l=e&&e in o?o[e]:e,u=n&&n in o?o[n]:n;return s.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 32 32",width:16,height:16,fill:l,stroke:u,ref:c,...a,children:s.jsx("path",{d:"M30.914 15.595c-.044-.099-1.103-2.447-3.457-4.801C24.322 7.657 20.36 6 16 6S7.679 7.657 4.542 10.794C2.19 13.148 1.125 15.5 1.086 15.595a1 1 0 0 0 0 .812c.044.1 1.103 2.447 3.456 4.8C7.68 24.344 11.64 26 16 26s8.321-1.657 11.458-4.792c2.353-2.354 3.412-4.702 3.456-4.8a1 1 0 0 0 0-.813M16 21a5 5 0 1 1 0-10 5 5 0 0 1 0 10"})})},Nm=h.forwardRef(Hm),_b=Nm,Fm=({fill:e="currentColor",stroke:n,...a},c)=>{const{colors:o}=j(),l=e&&e in o?o[e]:e,u=n&&n in o?o[n]:n;return s.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 32 32",width:16,height:16,fill:l,stroke:u,ref:c,...a,children:s.jsx("path",{d:"M6.74 4.328a1 1 0 1 0-1.48 1.345l2.405 2.646c-4.54 2.786-6.493 7.081-6.579 7.276a1 1 0 0 0 0 .813c.044.098 1.103 2.446 3.456 4.8C7.68 24.343 11.64 26 16 26c2.24.013 4.459-.448 6.509-1.354l2.75 3.027a1 1 0 1 0 1.48-1.345zm11.125 15.21a4 4 0 0 1-5.209-5.73zm13.049-3.13c-.053.117-1.319 2.92-4.17 5.475a1 1 0 0 1-1.408-.072L12.675 7.884a1 1 0 0 1 .575-1.66A17 17 0 0 1 16 6c4.36 0 8.321 1.658 11.458 4.794 2.353 2.354 3.412 4.702 3.456 4.801a1 1 0 0 1 0 .813"})})},zm=h.forwardRef(Fm),jb=zm,Wm=({fill:e="currentColor",stroke:n,...a},c)=>{const{colors:o}=j(),l=e&&e in o?o[e]:e,u=n&&n in o?o[n]:n;return s.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 32 32",width:16,height:16,fill:l,stroke:u,ref:c,...a,children:s.jsx("path",{d:"M17 15v12a1 1 0 0 1-2 0V15a1 1 0 0 1 2 0m8 9a1 1 0 0 0-1 1v2a1 1 0 0 0 2 0v-2a1 1 0 0 0-1-1m3-6h-2V5a1 1 0 0 0-2 0v13h-2a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1M7 20a1 1 0 0 0-1 1v6a1 1 0 1 0 2 0v-6a1 1 0 0 0-1-1m3-6H8V5a1 1 0 0 0-2 0v9H4a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1m9-6h-2V5a1 1 0 0 0-2 0v3h-2a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1"})})};h.forwardRef(Wm);const km=({fill:e="currentColor",stroke:n,...a},c)=>{const{colors:o}=j(),l=e&&e in o?o[e]:e,u=n&&n in o?o[n]:n;return s.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 32 32",width:16,height:16,fill:l,stroke:u,ref:c,...a,children:s.jsx("path",{d:"m26.48 16.851-7.474 7.559a1.97 1.97 0 0 1-1.4.585H9.415l-3.707 3.712a1.001 1.001 0 0 1-1.415-1.415l2.823-2.822L15.588 16h10.537a.5.5 0 0 1 .355.851m.607-13.03a8 8 0 0 0-10.737.518l-1.2 1.185a.5.5 0 0 0-.15.351v7.875l6.875-6.875a1 1 0 0 1 1.414 1.414L17.589 14h11.047a.5.5 0 0 0 .445-.27 8.01 8.01 0 0 0-1.994-9.909M7.854 20.904 13 15.758V8.845a.5.5 0 0 0-.851-.355L7.586 13A1.99 1.99 0 0 0 7 14.414v6.136a.5.5 0 0 0 .854.354"})})};h.forwardRef(km);const Um=({fill:e="currentColor",stroke:n,...a},c)=>{const{colors:o}=j(),l=e&&e in o?o[e]:e,u=n&&n in o?o[n]:n;return s.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 32 32",width:16,height:16,fill:l,stroke:u,ref:c,...a,children:s.jsx("path",{d:"m26.708 10.293-7-7A1 1 0 0 0 19 3H7a2 2 0 0 0-2 2v22a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V11a1 1 0 0 0-.293-.707M19 11V5.5l5.5 5.5z"})})};h.forwardRef(Um);const qm=({fill:e="currentColor",stroke:n,...a},c)=>{const{colors:o}=j(),l=e&&e in o?o[e]:e,u=n&&n in o?o[n]:n;return s.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 32 32",width:16,height:16,fill:l,stroke:u,ref:c,...a,children:s.jsx("path",{d:"m26.708 10.293-7-7A1 1 0 0 0 19 3H7a2 2 0 0 0-2 2v22a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V11a1 1 0 0 0-.293-.707m-7 11a1 1 0 0 1-1.415 1.415L16 20.414l-2.293 2.293a1 1 0 0 1-1.415-1.415L14.587 19l-2.293-2.293a1 1 0 1 1 1.415-1.415L16 17.587l2.293-2.293a1 1 0 0 1 1.415 1.415L17.414 19zM19 11V5.5l5.5 5.5z"})})};h.forwardRef(qm);const Gm=({fill:e="currentColor",stroke:n,...a},c)=>{const{colors:o}=j(),l=e&&e in o?o[e]:e,u=n&&n in o?o[n]:n;return s.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 32 32",width:16,height:16,fill:l,stroke:u,ref:c,...a,children:s.jsx("path",{d:"M6 15h20a1 1 0 0 0 1-1v-3a1 1 0 0 0-.293-.707l-7-7A1 1 0 0 0 19 3H7a2 2 0 0 0-2 2v9a1 1 0 0 0 1 1m13-9.5 5.5 5.5H19zM28 19a1 1 0 0 1-1 1h-3v2h2a1 1 0 0 1 0 2h-2v2a1 1 0 0 1-2 0v-7a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1M8 18H6a1 1 0 0 0-1 1v7a1 1 0 1 0 2 0v-1h1a3.5 3.5 0 1 0 0-7m0 5H7v-3h1a1.5 1.5 0 1 1 0 3m8-5h-2a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h2a4.5 4.5 0 1 0 0-9m0 7h-1v-5h1a2.5 2.5 0 0 1 0 5"})})};h.forwardRef(Gm);const Km=({fill:e="currentColor",stroke:n,...a},c)=>{const{colors:o}=j(),l=e&&e in o?o[e]:e,u=n&&n in o?o[n]:n;return s.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 32 32",width:16,height:16,fill:l,stroke:u,ref:c,...a,children:s.jsx("path",{d:"M25.5 16a1.5 1.5 0 0 1-1.5 1.5H8a1.5 1.5 0 1 1 0-3h16a1.5 1.5 0 0 1 1.5 1.5M29 8.5H3a1.5 1.5 0 0 0 0 3h26a1.5 1.5 0 1 0 0-3m-10 12h-6a1.5 1.5 0 1 0 0 3h6a1.5 1.5 0 1 0 0-3"})})},Ym=h.forwardRef(Km),Ab=Ym,Zm=({fill:e="currentColor",stroke:n,...a},c)=>{const{colors:o}=j(),l=e&&e in o?o[e]:e,u=n&&n in o?o[n]:n;return s.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 32 32",width:16,height:16,fill:l,stroke:u,ref:c,...a,children:s.jsx("path",{d:"M27 9H16.414L13 5.586A1.98 1.98 0 0 0 11.586 5H5a2 2 0 0 0-2 2v18.078A1.926 1.926 0 0 0 4.924 27H27.11A1.89 1.89 0 0 0 29 25.111V11a2 2 0 0 0-2-2M5 7h6.586l2 2H5z"})})};h.forwardRef(Zm);const Xm=({fill:e="currentColor",stroke:n,...a},c)=>{const{colors:o}=j(),l=e&&e in o?o[e]:e,u=n&&n in o?o[n]:n;return s.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 32 32",width:16,height:16,fill:l,stroke:u,ref:c,...a,children:s.jsx("path",{d:"M27 9h-4.385q.075-.06.146-.125A3.7 3.7 0 0 0 24 6.196 4.08 4.08 0 0 0 19.805 2a3.7 3.7 0 0 0-2.68 1.239A6.9 6.9 0 0 0 16 5.049a6.9 6.9 0 0 0-1.125-1.81A3.7 3.7 0 0 0 12.195 2 4.08 4.08 0 0 0 8 6.196a3.7 3.7 0 0 0 1.239 2.679q.072.06.146.125H5a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2v8a2 2 0 0 0 2 2h7.5a.5.5 0 0 0 .5-.5V15H5v-4h10v4h2v-4h10v4H17v11.5a.5.5 0 0 0 .5.5H25a2 2 0 0 0 2-2v-8a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2M10.564 7.375A1.7 1.7 0 0 1 10 6.125 2.076 2.076 0 0 1 12.074 4h.061a1.71 1.71 0 0 1 1.25.563c1.049 1.185 1.419 3.15 1.549 4.365-1.22-.13-3.184-.5-4.37-1.553m10.875 0c-1.186 1.05-3.155 1.42-4.375 1.55.148-1.314.561-3.237 1.561-4.361A1.7 1.7 0 0 1 19.875 4h.061A2.077 2.077 0 0 1 22 6.135a1.7 1.7 0 0 1-.564 1.24z"})})};h.forwardRef(Xm);const Qm=({fill:e="currentColor",stroke:n,...a},c)=>{const{colors:o}=j(),l=e&&e in o?o[e]:e,u=n&&n in o?o[n]:n;return s.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 32 32",width:16,height:16,fill:l,stroke:u,ref:c,...a,children:s.jsx("path",{d:"M16 3a13 13 0 1 0 13 13A13.013 13.013 0 0 0 16 3m9.796 8h-4.428a17.8 17.8 0 0 0-2.533-5.625A11.05 11.05 0 0 1 25.796 11M16 5.014c1.5 1.625 2.625 3.693 3.296 5.986h-6.592C13.375 8.707 14.5 6.641 16 5.014M12 16c0-1.005.084-2.009.25-3h7.5a18.2 18.2 0 0 1 0 6h-7.5a18 18 0 0 1-.25-3m.704 5h6.592c-.671 2.293-1.796 4.359-3.296 5.986-1.5-1.627-2.625-3.693-3.296-5.986m6.131 5.625A17.8 17.8 0 0 0 21.367 21h4.43a11.05 11.05 0 0 1-6.962 5.625M21.776 19a20.2 20.2 0 0 0 0-6h4.808a11 11 0 0 1 0 6z"})})};h.forwardRef(Qm);const Jm=({fill:e="currentColor",stroke:n,...a},c)=>{const{colors:o}=j(),l=e&&e in o?o[e]:e,u=n&&n in o?o[n]:n;return s.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 32 32",width:16,height:16,fill:l,stroke:u,ref:c,...a,children:s.jsx("path",{fillRule:"evenodd",d:"M13.29 28.226 6.765 24.46a2.822 2.822 0 1 1-2.708-4.693v-7.532a2.824 2.824 0 1 1 2.708-4.693l6.525-3.767a2.824 2.824 0 1 1 5.42 0l6.524 3.766a2.822 2.822 0 1 1 2.71 4.693v7.533a2.824 2.824 0 1 1-2.71 4.694l-6.524 3.766A2.825 2.825 0 0 1 16 31.84a2.822 2.822 0 0 1-2.71-3.614M16 5.806q.413-.002.791-.113l8.531 14.776a2.8 2.8 0 0 0-.791 1.37H7.467a2.8 2.8 0 0 0-.79-1.369L15.21 5.693q.377.11.791.112M7.468 23.178l-.033.12 6.526 3.767A2.81 2.81 0 0 1 16 26.195c.802 0 1.526.334 2.04.871l6.523-3.766-.032-.121zM5.397 12.233a2.824 2.824 0 0 0 2.038-3.532l6.526-3.767q.043.045.088.088L5.517 19.8l-.12-.032zM26.482 19.8q.06-.018.121-.033v-7.532a2.824 2.824 0 0 1-2.04-3.534L18.04 4.934q-.045.045-.089.088z",clipRule:"evenodd"})})};h.forwardRef(Jm);const Pm=({fill:e="currentColor",stroke:n,...a},c)=>{const{colors:o}=j(),l=e&&e in o?o[e]:e,u=n&&n in o?o[n]:n;return s.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 32 32",width:16,height:16,fill:l,stroke:u,ref:c,...a,children:s.jsx("path",{d:"M27 7v7.5a.5.5 0 0 1-.5.5H17V5.5a.5.5 0 0 1 .5-.5H25a2 2 0 0 1 2 2M14.5 5H7a2 2 0 0 0-2 2v7.5a.5.5 0 0 0 .5.5H15V5.5a.5.5 0 0 0-.5-.5m12 12H17v9.5a.5.5 0 0 0 .5.5H25a2 2 0 0 0 2-2v-7.5a.5.5 0 0 0-.5-.5M5 17.5V25a2 2 0 0 0 2 2h7.5a.5.5 0 0 0 .5-.5V17H5.5a.5.5 0 0 0-.5.5"})})};h.forwardRef(Pm);const ex=({fill:e="currentColor",stroke:n,...a},c)=>{const{colors:o}=j(),l=e&&e in o?o[e]:e,u=n&&n in o?o[n]:n;return s.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 32 32",width:16,height:16,fill:l,stroke:u,ref:c,...a,children:s.jsx("path",{d:"M10.5 6.5v5h-7A.5.5 0 0 1 3 11V8a2 2 0 0 1 2-2h5a.5.5 0 0 1 .5.5m2 19a.5.5 0 0 0 .5.5h6a.5.5 0 0 0 .5-.5v-5h-7zM3 21v3a2 2 0 0 0 2 2h5a.5.5 0 0 0 .5-.5v-5h-7a.5.5 0 0 0-.5.5m0-7v4a.5.5 0 0 0 .5.5h7v-5h-7a.5.5 0 0 0-.5.5m16-8h-6a.5.5 0 0 0-.5.5v5h7v-5A.5.5 0 0 0 19 6m9.5 7.5h-7v5h7a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 0-.5-.5m-16 5h7v-5h-7zM27 6h-5a.5.5 0 0 0-.5.5v5h7a.5.5 0 0 0 .5-.5V8a2 2 0 0 0-2-2m1.5 14.5h-7v5a.5.5 0 0 0 .5.5h5a2 2 0 0 0 2-2v-3a.5.5 0 0 0-.5-.5"})})};h.forwardRef(ex);const tx=({fill:e="currentColor",stroke:n,...a},c)=>{const{colors:o}=j(),l=e&&e in o?o[e]:e,u=n&&n in o?o[n]:n;return s.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 32 32",width:16,height:16,fill:l,stroke:u,ref:c,...a,children:s.jsx("path",{d:"M28.791 17.633a3.04 3.04 0 0 0-2.326-.597C28.813 14.666 30 12.31 30 10c0-3.309-2.661-6-5.933-6A5.95 5.95 0 0 0 19.5 6.094 5.95 5.95 0 0 0 14.932 4C11.663 4 9 6.691 9 10c0 1.375.405 2.711 1.258 4.125a4 4 0 0 0-1.844 1.05L5.586 18H2a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h13q.123 0 .242-.03l8-2a1 1 0 0 0 .15-.05l4.858-2.067.055-.025a3.074 3.074 0 0 0 .491-5.195zm-1.362 3.393-4.75 2.023L14.875 25H7v-5.586l2.829-2.828A1.98 1.98 0 0 1 11.242 16H17.5a1.5 1.5 0 0 1 0 3H14a1 1 0 0 0 0 2h4q.113 0 .224-.025l8.375-1.926.038-.01a1.075 1.075 0 0 1 .788 1.987z"})})};h.forwardRef(tx);const nx=({fill:e="currentColor",stroke:n,...a},c)=>{const{colors:o}=j(),l=e&&e in o?o[e]:e,u=n&&n in o?o[n]:n;return s.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 32 32",width:16,height:16,fill:l,stroke:u,ref:c,...a,children:s.jsx("path",{d:"M28 10.5h-5.475l.951-5.231a1.5 1.5 0 1 0-2.952-.538L19.475 10.5h-4.95l.951-5.231a1.5 1.5 0 1 0-2.952-.538L11.475 10.5H6a1.5 1.5 0 0 0 0 3h4.93l-.909 5H4a1.5 1.5 0 0 0 0 3h5.475l-.951 5.231a1.5 1.5 0 0 0 1.207 1.75q.134.022.269.019a1.5 1.5 0 0 0 1.475-1.233l1.05-5.767h4.95l-.951 5.231a1.5 1.5 0 1 0 2.952.543l1.049-5.774H26a1.5 1.5 0 1 0 0-3h-4.93l.909-5H28a1.5 1.5 0 1 0 0-3m-9.979 8H13.07l.909-5h4.951z"})})};h.forwardRef(nx);const rx=({fill:e="currentColor",stroke:n,...a},c)=>{const{colors:o}=j(),l=e&&e in o?o[e]:e,u=n&&n in o?o[n]:n;return s.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 32 32",width:16,height:16,fill:l,stroke:u,ref:c,...a,children:s.jsx("path",{d:"M31.5 22.5a5 5 0 0 1-5 5 4.94 4.94 0 0 1-3.571-1.45 1.5 1.5 0 0 1 2.142-2.1 1.94 1.94 0 0 0 1.429.55 2 2 0 0 0 0-4 1.94 1.94 0 0 0-1.429.55 1.5 1.5 0 0 1-2.551-1.3l1-6A1.5 1.5 0 0 1 25 12.5h5a1.5 1.5 0 1 1 0 3h-3.729l-.338 2.029q.283-.03.567-.029a5 5 0 0 1 5 5M18 5.5A1.5 1.5 0 0 0 16.5 7v6h-10V7a1.5 1.5 0 0 0-3 0v15a1.5 1.5 0 0 0 3 0v-6h10v6a1.5 1.5 0 1 0 3 0V7A1.5 1.5 0 0 0 18 5.5"})})};h.forwardRef(rx);const ox=({fill:e="currentColor",stroke:n,...a},c)=>{const{colors:o}=j(),l=e&&e in o?o[e]:e,u=n&&n in o?o[n]:n;return s.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 32 32",width:16,height:16,fill:l,stroke:u,ref:c,...a,children:s.jsx("path",{d:"M32 22a1.5 1.5 0 0 1-1.5 1.5V26a1.5 1.5 0 1 1-3 0v-2.5H23a1.5 1.5 0 0 1-1.422-1.974l3-9a1.5 1.5 0 0 1 2.845.948L25.08 20.5H27.5V18a1.5 1.5 0 1 1 3 0v2.5A1.5 1.5 0 0 1 32 22M18 5.5A1.5 1.5 0 0 0 16.5 7v6h-10V7a1.5 1.5 0 0 0-3 0v15a1.5 1.5 0 0 0 3 0v-6h10v6a1.5 1.5 0 1 0 3 0V7A1.5 1.5 0 0 0 18 5.5"})})};h.forwardRef(ox);const ax=({fill:e="currentColor",stroke:n,...a},c)=>{const{colors:o}=j(),l=e&&e in o?o[e]:e,u=n&&n in o?o[n]:n;return s.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 32 32",width:16,height:16,fill:l,stroke:u,ref:c,...a,children:s.jsx("path",{d:"M29.5 14v12a1.5 1.5 0 1 1-3 0v-9.198l-.668.448a1.503 1.503 0 0 1-1.665-2.5l3-2A1.5 1.5 0 0 1 29.5 14M18 5.5A1.5 1.5 0 0 0 16.5 7v6h-10V7a1.5 1.5 0 0 0-3 0v15a1.5 1.5 0 0 0 3 0v-6h10v6a1.5 1.5 0 1 0 3 0V7A1.5 1.5 0 0 0 18 5.5"})})};h.forwardRef(ax);const ix=({fill:e="currentColor",stroke:n,...a},c)=>{const{colors:o}=j(),l=e&&e in o?o[e]:e,u=n&&n in o?o[n]:n;return s.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 32 32",width:16,height:16,fill:l,stroke:u,ref:c,...a,children:s.jsx("path",{d:"m27.133 17.541 1.655-2.772a1.5 1.5 0 1 0-2.576-1.538l-4.03 6.75q-.018.029-.032.059a5 5 0 1 0 4.983-2.5zM26.5 24.5a2 2 0 1 1 0-4 2 2 0 0 1 0 4M19.5 7v15a1.5 1.5 0 1 1-3 0v-6h-10v6a1.5 1.5 0 0 1-3 0V7a1.5 1.5 0 0 1 3 0v6h10V7a1.5 1.5 0 1 1 3 0"})})};h.forwardRef(ix);const sx=({fill:e="currentColor",stroke:n,...a},c)=>{const{colors:o}=j(),l=e&&e in o?o[e]:e,u=n&&n in o?o[n]:n;return s.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 32 32",width:16,height:16,fill:l,stroke:u,ref:c,...a,children:s.jsx("path",{d:"M31.5 22.5a5 5 0 0 1-8.571 3.5 1.5 1.5 0 1 1 2.142-2.099A2 2 0 1 0 26.5 20.5a1.5 1.5 0 0 1-1.229-2.36l1.854-2.64H24a1.5 1.5 0 1 1 0-3h6a1.5 1.5 0 0 1 1.229 2.36l-2.293 3.275A5 5 0 0 1 31.5 22.5M18 5.5A1.5 1.5 0 0 0 16.5 7v6h-10V7a1.5 1.5 0 0 0-3 0v15a1.5 1.5 0 0 0 3 0v-6h10v6a1.5 1.5 0 1 0 3 0V7A1.5 1.5 0 0 0 18 5.5"})})};h.forwardRef(sx);const cx=({fill:e="currentColor",stroke:n,...a},c)=>{const{colors:o}=j(),l=e&&e in o?o[e]:e,u=n&&n in o?o[n]:n;return s.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 32 32",width:16,height:16,fill:l,stroke:u,ref:c,...a,children:s.jsx("path",{d:"M19.5 7v15a1.5 1.5 0 1 1-3 0v-6h-10v6a1.5 1.5 0 0 1-3 0V7a1.5 1.5 0 0 1 3 0v6h10V7a1.5 1.5 0 1 1 3 0M30 24.5h-3l3.593-4.791a4.499 4.499 0 1 0-7.837-4.209 1.5 1.5 0 1 0 2.829 1q.076-.218.216-.402a1.5 1.5 0 1 1 2.394 1.807L22.8 25.1a1.5 1.5 0 0 0 1.2 2.4h6a1.5 1.5 0 1 0 0-3"})})};h.forwardRef(cx);const lx=({fill:e="currentColor",stroke:n,...a},c)=>{const{colors:o}=j(),l=e&&e in o?o[e]:e,u=n&&n in o?o[n]:n;return s.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 32 32",width:16,height:16,fill:l,stroke:u,ref:c,...a,children:s.jsx("path",{d:"M29 17v7a3 3 0 0 1-3 3h-2a3 3 0 0 1-3-3v-5a3 3 0 0 1 3-3h2.956A10.964 10.964 0 0 0 16.081 6H16A11 11 0 0 0 5.045 16H8a3 3 0 0 1 3 3v5a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3v-7a13.014 13.014 0 0 1 22.236-9.167A12.93 12.93 0 0 1 29 17"})})};h.forwardRef(lx);const ux=({fill:e="currentColor",stroke:n,...a},c)=>{const{colors:o}=j(),l=e&&e in o?o[e]:e,u=n&&n in o?o[n]:n;return s.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 32 32",width:16,height:16,fill:l,stroke:u,ref:c,...a,children:s.jsx("path",{d:"M30 11.75c0 8.75-12.974 15.833-13.526 16.125a1 1 0 0 1-.948 0C14.974 27.582 2 20.5 2 11.75A7.76 7.76 0 0 1 9.75 4c2.581 0 4.841 1.11 6.25 2.986C17.409 5.11 19.669 4 22.25 4A7.76 7.76 0 0 1 30 11.75"})})};h.forwardRef(ux);const dx=({fill:e="currentColor",stroke:n,...a},c)=>{const{colors:o}=j(),l=e&&e in o?o[e]:e,u=n&&n in o?o[n]:n;return s.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 32 32",width:16,height:16,fill:l,stroke:u,ref:c,...a,children:s.jsx("path",{d:"M28 14.444V26a2 2 0 0 1-2 2h-5a2 2 0 0 1-2-2v-5a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V14.444a2 2 0 0 1 .646-1.473l10-9.435.014-.013a2 2 0 0 1 2.705.013l10 9.435A2 2 0 0 1 28 14.444"})})};h.forwardRef(dx);const hx=({fill:e="currentColor",stroke:n,...a},c)=>{const{colors:o}=j(),l=e&&e in o?o[e]:e,u=n&&n in o?o[n]:n;return s.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 32 32",width:16,height:16,fill:l,stroke:u,ref:c,...a,children:s.jsx("path",{d:"M27 5H5a2 2 0 0 0-2 2v18a2 2 0 0 0 2 2h22a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2m-7.5 6a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3M5 25v-3.5l6.5-6.5 10 10zm22 0h-2.671l-4.5-4.5 2.5-2.5L27 22.672z"})})};h.forwardRef(hx);const fx=({fill:e="currentColor",stroke:n,...a},c)=>{const{colors:o}=j(),l=e&&e in o?o[e]:e,u=n&&n in o?o[n]:n;return s.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 32 32",width:16,height:16,fill:l,stroke:u,ref:c,...a,children:s.jsx("path",{d:"M27 5H9a2 2 0 0 0-2 2v2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2v-2h2a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2m-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3M23 25H5V11h2v10a2 2 0 0 0 2 2h14zm4-4H9v-4.5l4.5-4.5 6.208 6.208a1 1 0 0 0 1.413 0L24.33 15 27 17.672z"})})};h.forwardRef(fx);const gx=({fill:e="currentColor",stroke:n,...a},c)=>{const{colors:o}=j(),l=e&&e in o?o[e]:e,u=n&&n in o?o[n]:n;return s.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 32 32",width:16,height:16,fill:l,stroke:u,ref:c,...a,children:s.jsx("path",{d:"M28.5 16a1.5 1.5 0 0 1-1.5 1.5H15a1.5 1.5 0 0 1 0-3h12a1.5 1.5 0 0 1 1.5 1.5M15 9.5h12a1.5 1.5 0 0 0 0-3H15a1.5 1.5 0 0 0 0 3m12 13H5a1.5 1.5 0 1 0 0 3h22a1.5 1.5 0 0 0 0-3m-18-4a1.5 1.5 0 0 0 1.061-2.561L6.125 12l3.936-3.94a1.503 1.503 0 1 0-2.125-2.125l-5 5a1.5 1.5 0 0 0 0 2.125l5 5A1.5 1.5 0 0 0 9 18.5"})})};h.forwardRef(gx);const wx=({fill:e="currentColor",stroke:n,...a},c)=>{const{colors:o}=j(),l=e&&e in o?o[e]:e,u=n&&n in o?o[n]:n;return s.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 32 32",width:16,height:16,fill:l,stroke:u,ref:c,...a,children:s.jsx("path",{d:"M28.5 16a1.5 1.5 0 0 1-1.5 1.5H15a1.5 1.5 0 0 1 0-3h12a1.5 1.5 0 0 1 1.5 1.5M15 9.5h12a1.5 1.5 0 0 0 0-3H15a1.5 1.5 0 0 0 0 3m12 13H5a1.5 1.5 0 0 0 0 3h22a1.5 1.5 0 1 0 0-3M3.939 18.06a1.5 1.5 0 0 0 2.125 0l5-5a1.5 1.5 0 0 0 0-2.125l-5-5a1.503 1.503 0 0 0-2.125 2.125L7.875 12l-3.936 3.939a1.5 1.5 0 0 0 0 2.122"})})};h.forwardRef(wx);const mx=({fill:e="currentColor",stroke:n,...a},c)=>{const{colors:o}=j(),l=e&&e in o?o[e]:e,u=n&&n in o?o[n]:n;return s.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 32 32",width:16,height:16,fill:l,stroke:u,ref:c,...a,children:s.jsx("path",{d:"M16 3a13 13 0 1 0 13 13A13.013 13.013 0 0 0 16 3m-.5 6a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3M17 23a2 2 0 0 1-2-2v-5a1 1 0 0 1 0-2 2 2 0 0 1 2 2v5a1 1 0 0 1 0 2"})})},xx=h.forwardRef(mx),vx=xx,px=({fill:e="currentColor",stroke:n,...a},c)=>{const{colors:o}=j(),l=e&&e in o?o[e]:e,u=n&&n in o?o[n]:n;return s.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 32 32",width:16,height:16,fill:l,stroke:u,ref:c,...a,children:s.jsx("path",{d:"M25.5 7A1.5 1.5 0 0 1 24 8.5h-3.919l-5 15H18a1.5 1.5 0 1 1 0 3H8a1.5 1.5 0 1 1 0-3h3.919l5-15H14a1.5 1.5 0 0 1 0-3h10A1.5 1.5 0 0 1 25.5 7"})})};h.forwardRef(px);const bx=({fill:e="currentColor",stroke:n,...a},c)=>{const{colors:o}=j(),l=e&&e in o?o[e]:e,u=n&&n in o?o[n]:n;return s.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 32 32",width:16,height:16,fill:l,stroke:u,ref:c,...a,children:s.jsx("path",{d:"M20 2a10.01 10.01 0 0 0-9.511 13.098l-7.196 7.195A1 1 0 0 0 3 23v5a1 1 0 0 0 1 1h5a1 1 0 0 0 1-1v-2h2a1 1 0 0 0 1-1v-2h2a1 1 0 0 0 .707-.293l1.195-1.196A10 10 0 1 0 20 2m2.5 9.5a2 2 0 1 1 0-4 2 2 0 0 1 0 4"})})};h.forwardRef(bx);const $x=({fill:e="currentColor",stroke:n,...a},c)=>{const{colors:o}=j(),l=e&&e in o?o[e]:e,u=n&&n in o?o[n]:n;return s.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 32 32",width:16,height:16,fill:l,stroke:u,ref:c,...a,children:s.jsx("path",{d:"M27 5H5a2 2 0 0 0-2 2v18a2 2 0 0 0 2 2h22a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2M5 7h22v5H5zm22 18H14V14h13z"})})};h.forwardRef($x);const Cx=({fill:e="currentColor",stroke:n,...a},c)=>{const{colors:o}=j(),l=e&&e in o?o[e]:e,u=n&&n in o?o[n]:n;return s.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 32 32",width:16,height:16,fill:l,stroke:u,ref:c,...a,children:s.jsx("path",{d:"M22 29a1 1 0 0 1-1 1H11a1 1 0 1 1 0-2h10a1 1 0 0 1 1 1m5-16a10.94 10.94 0 0 1-4.205 8.651A2.03 2.03 0 0 0 22 23.25V24a2 2 0 0 1-2 2h-8a2 2 0 0 1-2-2v-.75a2 2 0 0 0-.779-1.582A10.95 10.95 0 0 1 5 13.06C4.967 7.104 9.782 2.143 15.735 2A11 11 0 0 1 27 13m-4.014-1.168a7.2 7.2 0 0 0-5.82-5.818 1 1 0 1 0-.332 1.972c2.071.349 3.829 2.106 4.18 4.182a1 1 0 0 0 1.972-.335"})})};h.forwardRef(Cx);const yx=({fill:e="currentColor",stroke:n,...a},c)=>{const{colors:o}=j(),l=e&&e in o?o[e]:e,u=n&&n in o?o[n]:n;return s.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 32 32",width:16,height:16,fill:l,stroke:u,ref:c,...a,children:s.jsx("path",{d:"m21.731 14.683-14 15a1 1 0 0 1-1.711-.875l1.832-9.167L.65 16.936a1 1 0 0 1-.375-1.625l14-15a1 1 0 0 1 1.71.875l-1.837 9.177 7.204 2.7a1 1 0 0 1 .375 1.62z"})})};h.forwardRef(yx);const Sx=({fill:e="currentColor",stroke:n,...a},c)=>{const{colors:o}=j(),l=e&&e in o?o[e]:e,u=n&&n in o?o[n]:n;return s.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 32 32",width:16,height:16,fill:l,stroke:u,ref:c,...a,children:s.jsx("path",{d:"M17.046 23.441a1.5 1.5 0 0 1 0 2.125l-.742.743a7.502 7.502 0 1 1-10.61-10.61l3.015-3.014A7.5 7.5 0 0 1 19 12.375a1.506 1.506 0 0 1-2 2.25 4.5 4.5 0 0 0-6.171.184l-3.013 3.01a4.5 4.5 0 0 0 6.365 6.365l.743-.743a1.5 1.5 0 0 1 2.122 0m9.26-17.75a7.51 7.51 0 0 0-10.61 0l-.742.743a1.503 1.503 0 1 0 2.125 2.125l.742-.743a4.5 4.5 0 0 1 6.365 6.365l-3.014 3.015a4.5 4.5 0 0 1-6.172.179 1.506 1.506 0 1 0-2 2.25 7.5 7.5 0 0 0 10.288-.304l3.014-3.014a7.51 7.51 0 0 0 .004-10.613z"})})};h.forwardRef(Sx);const Rx=({fill:e="currentColor",stroke:n,...a},c)=>{const{colors:o}=j(),l=e&&e in o?o[e]:e,u=n&&n in o?o[n]:n;return s.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 32 32",width:16,height:16,fill:l,stroke:u,ref:c,...a,children:s.jsx("path",{d:"M28.5 16a1.5 1.5 0 0 1-1.5 1.5H5a1.5 1.5 0 1 1 0-3h22a1.5 1.5 0 0 1 1.5 1.5M5 9.5h22a1.5 1.5 0 0 0 0-3H5a1.5 1.5 0 0 0 0 3m22 13H5a1.5 1.5 0 1 0 0 3h22a1.5 1.5 0 1 0 0-3"})})};h.forwardRef(Rx);const _x=({fill:e="currentColor",stroke:n,...a},c)=>{const{colors:o}=j(),l=e&&e in o?o[e]:e,u=n&&n in o?o[n]:n;return s.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 32 32",width:16,height:16,fill:l,stroke:u,ref:c,...a,children:s.jsx("path",{d:"M3.5 8A1.5 1.5 0 0 1 5 6.5h22a1.5 1.5 0 0 1 0 3H5A1.5 1.5 0 0 1 3.5 8M5 17.5h22a1.5 1.5 0 1 0 0-3H5a1.5 1.5 0 1 0 0 3m13 5H5a1.5 1.5 0 1 0 0 3h13a1.5 1.5 0 1 0 0-3m11 0h-1.5V21a1.5 1.5 0 1 0-3 0v1.5H23a1.5 1.5 0 1 0 0 3h1.5V27a1.5 1.5 0 1 0 3 0v-1.5H29a1.5 1.5 0 1 0 0-3"})})};h.forwardRef(_x);const jx=({fill:e="currentColor",stroke:n,...a},c)=>{const{colors:o}=j(),l=e&&e in o?o[e]:e,u=n&&n in o?o[n]:n;return s.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 32 32",width:16,height:16,fill:l,stroke:u,ref:c,...a,children:s.jsx("path",{d:"M17.5 4v4a1.5 1.5 0 1 1-3 0V4a1.5 1.5 0 1 1 3 0m4.156 7.844a1.5 1.5 0 0 0 1.062-.44l2.828-2.829a1.503 1.503 0 1 0-2.125-2.125l-2.825 2.833a1.5 1.5 0 0 0 1.06 2.56M28 14.5h-4a1.5 1.5 0 1 0 0 3h4a1.5 1.5 0 1 0 0-3m-5.282 6.096a1.501 1.501 0 0 0-2.451 1.638c.075.182.186.348.326.487l2.828 2.829a1.503 1.503 0 0 0 2.125-2.125zM16 22.5a1.5 1.5 0 0 0-1.5 1.5v4a1.5 1.5 0 1 0 3 0v-4a1.5 1.5 0 0 0-1.5-1.5m-6.717-1.904-2.83 2.829A1.503 1.503 0 0 0 8.58 25.55l2.829-2.829a1.503 1.503 0 0 0-2.125-2.125M9.5 16A1.5 1.5 0 0 0 8 14.5H4a1.5 1.5 0 1 0 0 3h4A1.5 1.5 0 0 0 9.5 16m-.925-9.546A1.503 1.503 0 0 0 6.45 8.579l2.833 2.825a1.503 1.503 0 0 0 2.125-2.125z"})})},Ax=h.forwardRef(jx),gl=Ax,Ix=({fill:e="currentColor",stroke:n,...a},c)=>{const{colors:o}=j(),l=e&&e in o?o[e]:e,u=n&&n in o?o[n]:n;return s.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 32 32",width:16,height:16,fill:l,stroke:u,ref:c,...a,children:s.jsx("path",{d:"M26 10h-4V7a6 6 0 1 0-12 0v3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h20a2 2 0 0 0 2-2V12a2 2 0 0 0-2-2M16 20.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3M20 10h-8V7a4 4 0 1 1 8 0z"})})};h.forwardRef(Ix);const Tx=({fill:e="currentColor",stroke:n,...a},c)=>{const{colors:o}=j(),l=e&&e in o?o[e]:e,u=n&&n in o?o[n]:n;return s.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 32 32",width:16,height:16,fill:l,stroke:u,ref:c,...a,children:s.jsx("path",{d:"M31 19a1 1 0 0 1-1 1h-2v2a1 1 0 0 1-2 0v-2h-2a1 1 0 0 1 0-2h2v-2a1 1 0 1 1 2 0v2h2a1 1 0 0 1 1 1M7 9h2v2a1 1 0 1 0 2 0V9h2a1 1 0 0 0 0-2h-2V5a1 1 0 0 0-2 0v2H7a1 1 0 0 0 0 2m16 15h-1v-1a1 1 0 0 0-2 0v1h-1a1 1 0 0 0 0 2h1v1a1 1 0 1 0 2 0v-1h1a1 1 0 0 0 0-2m4.414-14L10 27.414a2 2 0 0 1-2.828 0l-2.587-2.585a2 2 0 0 1 0-2.829L22 4.586a2 2 0 0 1 2.829 0l2.585 2.585a2 2 0 0 1 0 2.829M26 8.586 23.414 6l-4 4L22 12.586z"})})};h.forwardRef(Tx);const Mx=({fill:e="currentColor",stroke:n,...a},c)=>{const{colors:o}=j(),l=e&&e in o?o[e]:e,u=n&&n in o?o[n]:n;return s.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 32 32",width:16,height:16,fill:l,stroke:u,ref:c,...a,children:s.jsx("path",{d:"M28 6H4a1 1 0 0 0-1 1v17a2 2 0 0 0 2 2h22a2 2 0 0 0 2-2V7a1 1 0 0 0-1-1M12.339 16 5 22.726V9.274zm1.48 1.356 1.5 1.381a1 1 0 0 0 1.352 0l1.5-1.38L25.421 24H6.571zM19.66 16 27 9.273v13.455z"})})};h.forwardRef(Mx);const Ex=({fill:e="currentColor",stroke:n,...a},c)=>{const{colors:o}=j(),l=e&&e in o?o[e]:e,u=n&&n in o?o[n]:n;return s.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 32 32",width:16,height:16,fill:l,stroke:u,ref:c,...a,children:s.jsx("path",{fillRule:"evenodd",d:"M11 7q0 .432-.088.838L16 10.382l5.088-2.544a4 4 0 1 1 .895 1.789L18.236 11.5l3.747 1.873a4 4 0 1 1 0 5.253L18.236 20.5l3.747 1.874a4 4 0 1 1-.895 1.788L16 21.618l-5.088 2.544Q11 24.567 11 25a4 4 0 1 1-.983-2.626l3.747-1.874-3.747-1.873a4 4 0 1 1 0-5.253l3.747-1.874-3.747-1.874A4 4 0 1 1 11 7M9 7a2 2 0 1 1-4 0 2 2 0 0 1 4 0m2.236 8h9.528L16 12.618zM9 25a2 2 0 1 1-4 0 2 2 0 0 1 4 0m-2-7a2 2 0 1 0 0-4 2 2 0 0 0 0 4M27 7a2 2 0 1 1-4 0 2 2 0 0 1 4 0m-2 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4m2-11a2 2 0 1 1-4 0 2 2 0 0 1 4 0m-11 3.382L20.764 17h-9.528z",clipRule:"evenodd"})})};h.forwardRef(Ex);const Lx=({fill:e="currentColor",stroke:n,...a},c)=>{const{colors:o}=j(),l=e&&e in o?o[e]:e,u=n&&n in o?o[n]:n;return s.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 32 32",width:16,height:16,fill:l,stroke:u,ref:c,...a,children:s.jsx("path",{fillRule:"evenodd",d:"M14.8 8.254a4 4 0 1 0-1.082 1.682l7.483 4.81a4 4 0 0 0-.075.254H10.874A4.002 4.002 0 0 0 3 16a4 4 0 0 0 7.874 1h10.252q.033.128.075.254l-7.484 4.81a4 4 0 1 0 1.082 1.682l7.484-4.81a4 4 0 1 0 0-5.871zM11 9a2 2 0 1 0 0-4 2 2 0 0 0 0 4m0 18a2 2 0 1 0 0-4 2 2 0 0 0 0 4M9 16a2 2 0 1 1-4 0 2 2 0 0 1 4 0m16 2a2 2 0 1 0 0-4 2 2 0 0 0 0 4",clipRule:"evenodd"})})};h.forwardRef(Lx);const Vx=({fill:e="currentColor",stroke:n,...a},c)=>{const{colors:o}=j(),l=e&&e in o?o[e]:e,u=n&&n in o?o[n]:n;return s.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 32 32",width:16,height:16,fill:l,stroke:u,ref:c,...a,children:s.jsx("path",{fillRule:"evenodd",d:"M18.842 3.227a1 1 0 1 0-.445 1.95l1.747.399L9.6 12.959a4 4 0 1 0 0 6.081l10.546 7.385-1.748.399a1 1 0 1 0 .445 1.95l3.945-.9a1 1 0 0 0 .77-1.1l-.503-4.014a1 1 0 0 0-1.985.248l.223 1.779-10.545-7.384a4 4 0 0 0 .127-.403h14.712l-1.293 1.293a1 1 0 1 0 1.414 1.414l3-3a1 1 0 0 0 0-1.414l-3-3a1 1 0 0 0-1.414 1.414L25.586 15H10.874a4 4 0 0 0-.127-.403l10.544-7.383-.222 1.778a1 1 0 0 0 1.984.249l.503-4.015a1 1 0 0 0-.77-1.099zM9 16a2 2 0 1 1-4 0 2 2 0 0 1 4 0",clipRule:"evenodd"})})};h.forwardRef(Vx);const Bx=({fill:e="currentColor",stroke:n,...a},c)=>{const{colors:o}=j(),l=e&&e in o?o[e]:e,u=n&&n in o?o[n]:n;return s.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 32 32",width:16,height:16,fill:l,stroke:u,ref:c,...a,children:s.jsx("path",{d:"M27 6H5a2 2 0 0 0-2 2v20a1.98 1.98 0 0 0 1.156 1.813 1.986 1.986 0 0 0 2.141-.299L10.312 26H27a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2M10.5 17.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5.5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5.5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3"})})};h.forwardRef(Bx);const Dx=({fill:e="currentColor",stroke:n,...a},c)=>{const{colors:o}=j(),l=e&&e in o?o[e]:e,u=n&&n in o?o[n]:n;return s.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 32 32",width:16,height:16,fill:l,stroke:u,ref:c,...a,children:s.jsx("path",{d:"M10 16V8a6 6 0 1 1 12 0v8a6 6 0 1 1-12 0m16 0a1 1 0 0 0-2 0 8 8 0 0 1-16 0 1 1 0 1 0-2 0 10.014 10.014 0 0 0 9 9.95V29a1 1 0 0 0 2 0v-3.05A10.014 10.014 0 0 0 26 16"})})};h.forwardRef(Dx);const Ox=({fill:e="currentColor",stroke:n,...a},c)=>{const{colors:o}=j(),l=e&&e in o?o[e]:e,u=n&&n in o?o[n]:n;return s.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 32 32",width:16,height:16,fill:l,stroke:u,ref:c,...a,children:s.jsx("path",{d:"M28.5 16a1.5 1.5 0 0 1-1.5 1.5H5a1.5 1.5 0 1 1 0-3h22a1.5 1.5 0 0 1 1.5 1.5"})})},Hx=h.forwardRef(Ox),Nx=Hx,Fx=({fill:e="currentColor",stroke:n,...a},c)=>{const{colors:o}=j(),l=e&&e in o?o[e]:e,u=n&&n in o?o[n]:n;return s.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 32 32",width:16,height:16,fill:l,stroke:u,ref:c,...a,children:s.jsx("path",{d:"M16 3a13 13 0 1 0 13 13A13.013 13.013 0 0 0 16 3m5 14H11a1 1 0 0 1 0-2h10a1 1 0 0 1 0 2"})})};h.forwardRef(Fx);const zx=({fill:e="currentColor",stroke:n,...a},c)=>{const{colors:o}=j(),l=e&&e in o?o[e]:e,u=n&&n in o?o[n]:n;return s.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 32 32",width:16,height:16,fill:l,stroke:u,ref:c,...a,children:s.jsx("path",{d:"M26 5H6a3 3 0 0 0-3 3v14a3 3 0 0 0 3 3h20a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3M20 27h-8a1 1 0 0 0 0 2h8a1 1 0 0 0 0-2"})})};h.forwardRef(zx);const Wx=({fill:e="currentColor",stroke:n,...a},c)=>{const{colors:o}=j(),l=e&&e in o?o[e]:e,u=n&&n in o?o[n]:n;return s.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 32 32",width:16,height:16,fill:l,stroke:u,ref:c,...a,children:s.jsx("path",{d:"M29.443 18.776a13.1 13.1 0 0 1-4.626 6.614A13 13 0 0 1 4 15a12.9 12.9 0 0 1 2.61-7.815 13.1 13.1 0 0 1 6.614-4.625 1 1 0 0 1 1.25 1.25 11.01 11.01 0 0 0 13.725 13.725 1 1 0 0 1 1.25 1.25z"})})};h.forwardRef(Wx);const kx=({fill:e="currentColor",stroke:n,...a},c)=>{const{colors:o}=j(),l=e&&e in o?o[e]:e,u=n&&n in o?o[n]:n;return s.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 32 32",width:16,height:16,fill:l,stroke:u,ref:c,...a,children:s.jsx("path",{d:"M18 16a2 2 0 1 1-4 0 2 2 0 0 1 4 0M7.5 14a2 2 0 1 0 0 4 2 2 0 0 0 0-4m17 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4"})})};h.forwardRef(kx);const Ux=({fill:e="currentColor",stroke:n,...a},c)=>{const{colors:o}=j(),l=e&&e in o?o[e]:e,u=n&&n in o?o[n]:n;return s.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 32 32",width:16,height:16,fill:l,stroke:u,ref:c,...a,children:s.jsx("path",{d:"M10.939 8.061a1.5 1.5 0 0 1 0-2.125l4-4a1.5 1.5 0 0 1 2.125 0l4 4a1.503 1.503 0 1 1-2.125 2.125L17.5 6.625V12a1.5 1.5 0 1 1-3 0V6.625l-1.439 1.436a1.5 1.5 0 0 1-2.122 0m8 15.875L17.5 25.375V20a1.5 1.5 0 1 0-3 0v5.375l-1.439-1.44a1.504 1.504 0 0 0-2.125 2.125l4 4a1.5 1.5 0 0 0 2.125 0l4-4a1.502 1.502 0 1 0-2.125-2.125zm11.125-9-4-4a1.503 1.503 0 0 0-2.125 2.125l1.436 1.439H20a1.5 1.5 0 0 0 0 3h5.375l-1.44 1.439a1.503 1.503 0 0 0 2.125 2.125l4-4a1.5 1.5 0 0 0 .001-2.125zM6.625 17.5H12a1.5 1.5 0 1 0 0-3H6.625l1.44-1.439a1.503 1.503 0 1 0-2.125-2.125l-4 4a1.5 1.5 0 0 0 0 2.125l4 4a1.503 1.503 0 0 0 2.125-2.125z"})})};h.forwardRef(Ux);const qx=({fill:e="currentColor",stroke:n,...a},c)=>{const{colors:o}=j(),l=e&&e in o?o[e]:e,u=n&&n in o?o[n]:n;return s.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 32 32",width:16,height:16,fill:l,stroke:u,ref:c,...a,children:s.jsx("path",{d:"M26.615 3.214a.99.99 0 0 0-.857-.183l-16 4a1 1 0 0 0-.758.97v13.762a4.5 4.5 0 1 0 2 3.737V13.781l14-3.5v7.482a4.5 4.5 0 1 0 2 3.737V4a1 1 0 0 0-.385-.786"})})};h.forwardRef(qx);const Gx=({fill:e="currentColor",stroke:n,...a},c)=>{const{colors:o}=j(),l=e&&e in o?o[e]:e,u=n&&n in o?o[n]:n;return s.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 32 32",width:16,height:16,fill:l,stroke:u,ref:c,...a,children:s.jsx("path",{d:"M28.5 16a1.5 1.5 0 0 1-1.5 1.5H14.5a1.5 1.5 0 1 1 0-3H27a1.5 1.5 0 0 1 1.5 1.5m-14-6.5H27a1.5 1.5 0 0 0 0-3H14.5a1.5 1.5 0 0 0 0 3m12.5 13H14.5a1.5 1.5 0 1 0 0 3H27a1.5 1.5 0 1 0 0-3M5.5 7.414V13a1.5 1.5 0 0 0 3 0V5a1.5 1.5 0 0 0-2.17-1.341l-2 1a1.5 1.5 0 0 0 1.17 2.75zm4.966 12.107a3.46 3.46 0 0 0-1.4-2.329 3.61 3.61 0 0 0-4.954.683 3.5 3.5 0 0 0-.52.942 1.5 1.5 0 0 0 2.818 1.027.5.5 0 0 1 .072-.125.6.6 0 0 1 .813-.103.48.48 0 0 1 .201.325.45.45 0 0 1-.096.347l-.016.02-3.585 4.794A1.5 1.5 0 0 0 5 27.5h4a1.5 1.5 0 1 0 0-3H8l1.785-2.389a3.43 3.43 0 0 0 .681-2.59"})})};h.forwardRef(Gx);const Kx=({fill:e="currentColor",stroke:n,...a},c)=>{const{colors:o}=j(),l=e&&e in o?o[e]:e,u=n&&n in o?o[n]:n;return s.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 32 32",width:16,height:16,fill:l,stroke:u,ref:c,...a,children:s.jsx("path",{fillRule:"evenodd",d:"M17.2 8.254a4 4 0 1 1 1.082 1.682l-7.482 4.81q.04.125.074.254h10.252A4.002 4.002 0 0 1 29 16a4 4 0 0 1-7.874 1H10.874q-.033.128-.075.254l7.484 4.81a4 4 0 1 1-1.082 1.682l-7.484-4.81a4 4 0 1 1 0-5.871zM21 9a2 2 0 1 1 0-4 2 2 0 0 1 0 4m0 18a2 2 0 1 1 0-4 2 2 0 0 1 0 4m2-11a2 2 0 1 0 4 0 2 2 0 0 0-4 0M7 18a2 2 0 1 1 0-4 2 2 0 0 1 0 4",clipRule:"evenodd"})})};h.forwardRef(Kx);const Yx=({fill:e="currentColor",stroke:n,...a},c)=>{const{colors:o}=j(),l=e&&e in o?o[e]:e,u=n&&n in o?o[n]:n;return s.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 32 32",width:16,height:16,fill:l,stroke:u,ref:c,...a,children:s.jsx("path",{fillRule:"evenodd",d:"M10.874 17A4.002 4.002 0 0 1 3 16a4 4 0 0 1 7.874-1h10.252A4.002 4.002 0 0 1 29 16a4 4 0 0 1-7.874 1zM7 18a2 2 0 1 0 0-4 2 2 0 0 0 0 4m18 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4",clipRule:"evenodd"})})};h.forwardRef(Yx);const Zx=({fill:e="currentColor",stroke:n,...a},c)=>{const{colors:o}=j(),l=e&&e in o?o[e]:e,u=n&&n in o?o[n]:n;return s.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 32 32",width:16,height:16,fill:l,stroke:u,ref:c,...a,children:s.jsx("path",{fillRule:"evenodd",d:"M28.924 16.384c-.05.12-.124.231-.217.324l-4 4a1 1 0 0 1-1.632-.324 1 1 0 0 1 .217-1.09L25.585 17H10.875A4.002 4.002 0 0 1 3 16a4 4 0 0 1 7.874-1h14.712l-2.294-2.293a1 1 0 0 1 1.415-1.415l4 4a1 1 0 0 1 .217 1.09M7 18a2 2 0 1 0 0-4 2 2 0 0 0 0 4",clipRule:"evenodd"})})};h.forwardRef(Zx);const Xx=({fill:e="currentColor",stroke:n,...a},c)=>{const{colors:o}=j(),l=e&&e in o?o[e]:e,u=n&&n in o?o[n]:n;return s.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 32 32",width:16,height:16,fill:l,stroke:u,ref:c,...a,children:s.jsx("path",{d:"M29 4a1 1 0 0 0-1-1c-5.51 0-11.164 6.214-14.304 10.329A7.5 7.5 0 0 0 4 20.5c0 3.86-2.443 5.591-2.559 5.671A1 1 0 0 0 2 28h9.5a7.5 7.5 0 0 0 7.171-9.696C22.788 15.164 29 9.51 29 4M15.553 14.194a48 48 0 0 1 1.26-1.569 9.5 9.5 0 0 1 2.562 2.561q-.738.618-1.569 1.262a7.6 7.6 0 0 0-2.254-2.254m5.337-.335a11.6 11.6 0 0 0-2.75-2.75c3.973-4.316 6.969-5.625 8.738-5.989-.357 1.77-1.672 4.766-5.988 8.739"})})};h.forwardRef(Xx);const Qx=({fill:e="currentColor",stroke:n,...a},c)=>{const{colors:o}=j(),l=e&&e in o?o[e]:e,u=n&&n in o?o[n]:n;return s.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 32 32",width:16,height:16,fill:l,stroke:u,ref:c,...a,children:s.jsx("path",{d:"M31 13v6.25a2.01 2.01 0 0 1-1.45 1.922L17 24.75V29a1 1 0 0 1-2 0v-4.25a2.01 2.01 0 0 1 1.45-1.922L29 19.25V13h-2v3a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-3H2a1 1 0 0 1 0-2h2V8a2 2 0 0 1 2-2h19a2 2 0 0 1 2 2v3h2a2 2 0 0 1 2 2"})})};h.forwardRef(Qx);const Jx=({fill:e="currentColor",stroke:n,...a},c)=>{const{colors:o}=j(),l=e&&e in o?o[e]:e,u=n&&n in o?o[n]:n;return s.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 32 32",width:16,height:16,fill:l,stroke:u,ref:c,...a,children:s.jsx("path",{d:"M25.096 6.736A12.9 12.9 0 0 0 16 3h-.134A13 13 0 0 0 3 16c0 5.375 3.323 9.883 8.67 11.771A4 4 0 0 0 17 24a2 2 0 0 1 2-2h5.776a3.976 3.976 0 0 0 3.9-3.11c.224-.984.332-1.99.324-3a12.9 12.9 0 0 0-3.904-9.154M10.5 21a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m0-7a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5.5-3a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5.5 3a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3"})})};h.forwardRef(Jx);const Px=({fill:e="currentColor",stroke:n,...a},c)=>{const{colors:o}=j(),l=e&&e in o?o[e]:e,u=n&&n in o?o[n]:n;return s.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 32 32",width:16,height:16,fill:l,stroke:u,ref:c,...a,children:s.jsx("path",{d:"M28.925 5.543v.018L21.65 29.554A1.985 1.985 0 0 1 19.728 31a1.98 1.98 0 0 1-1.803-1.144l-4.464-9.423a.5.5 0 0 1 .099-.568l7.158-7.159a1 1 0 0 0-1.414-1.413l-7.169 7.157a.5.5 0 0 1-.567.099l-9.376-4.441A2.05 2.05 0 0 1 1 12.17a1.99 1.99 0 0 1 1.446-1.815L26.44 3.08h.018a2 2 0 0 1 2.468 2.463"})})};h.forwardRef(Px);const ev=({fill:e="currentColor",stroke:n,...a},c)=>{const{colors:o}=j(),l=e&&e in o?o[e]:e,u=n&&n in o?o[n]:n;return s.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 32 32",width:16,height:16,fill:l,stroke:u,ref:c,...a,children:s.jsx("path",{d:"m26.56 17.061-10.257 10.25a7.501 7.501 0 0 1-10.607-10.61l12.27-12.236a5 5 0 0 1 7.07 7.074l-.021.02L13.04 23.086a1.503 1.503 0 0 1-2.121-.041 1.5 1.5 0 0 1 .041-2.121L22.924 9.409a2 2 0 1 0-2.838-2.82L7.816 18.82a4.5 4.5 0 1 0 6.366 6.364l10.258-10.25a1.503 1.503 0 0 1 2.125 2.125z"})})};h.forwardRef(ev);const tv=({fill:e="currentColor",stroke:n,...a},c)=>{const{colors:o}=j(),l=e&&e in o?o[e]:e,u=n&&n in o?o[n]:n;return s.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 32 32",width:16,height:16,fill:l,stroke:u,ref:c,...a,children:s.jsx("path",{d:"M3.5 8A1.5 1.5 0 0 1 5 6.5h22a1.5 1.5 0 0 1 0 3H5A1.5 1.5 0 0 1 3.5 8M5 14.5h16a1.5 1.5 0 1 0 0-3H5a1.5 1.5 0 1 0 0 3m22 2H5a1.5 1.5 0 1 0 0 3h22a1.5 1.5 0 1 0 0-3m-6 5H5a1.5 1.5 0 1 0 0 3h16a1.5 1.5 0 1 0 0-3"})})};h.forwardRef(tv);const nv=({fill:e="currentColor",stroke:n,...a},c)=>{const{colors:o}=j(),l=e&&e in o?o[e]:e,u=n&&n in o?o[n]:n;return s.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 32 32",width:16,height:16,fill:l,stroke:u,ref:c,...a,children:s.jsx("path",{d:"m28.414 9.171-5.585-5.586a2 2 0 0 0-2.829 0L4.586 19A1.98 1.98 0 0 0 4 20.414V26a2 2 0 0 0 2 2h5.586A1.98 1.98 0 0 0 13 27.414L28.414 12a2 2 0 0 0 0-2.829M24 13.585 18.414 8l3-3L27 10.585z"})})},rv=h.forwardRef(nv),Ib=rv,ov=({fill:e="currentColor",stroke:n,...a},c)=>{const{colors:o}=j(),l=e&&e in o?o[e]:e,u=n&&n in o?o[n]:n;return s.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 32 32",width:16,height:16,fill:l,stroke:u,ref:c,...a,children:s.jsx("path",{d:"M28.985 21.885A7.03 7.03 0 0 1 22 28c-9.925 0-18-8.075-18-18a7.03 7.03 0 0 1 6.115-6.985 2 2 0 0 1 2.078 1.19l2.64 5.894v.015a2 2 0 0 1-.16 1.886 1 1 0 0 1-.07.096L12 15.181c.936 1.903 2.926 3.875 4.854 4.814l3.042-2.589q.045-.037.094-.07a2 2 0 0 1 1.896-.175l.017.008 5.888 2.639a2 2 0 0 1 1.194 2.077"})})};h.forwardRef(ov);const av=({fill:e="currentColor",stroke:n,...a},c)=>{const{colors:o}=j(),l=e&&e in o?o[e]:e,u=n&&n in o?o[n]:n;return s.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 32 32",width:16,height:16,fill:l,stroke:u,ref:c,...a,children:s.jsx("path",{d:"m29.416 13-6.683 6.706c.57 1.584.806 4.236-1.65 7.5a2 2 0 0 1-1.458.794h-.141a2 2 0 0 1-1.415-.586l-6.033-6.04-5.328 5.333a1 1 0 1 1-1.415-1.415l5.332-5.328-6.037-6.038a2 2 0 0 1 .162-2.972c3.178-2.564 6.219-2.06 7.55-1.643L19 2.587a2 2 0 0 1 2.829 0l7.586 7.585A2 2 0 0 1 29.416 13"})})};h.forwardRef(av);const iv=({fill:e="currentColor",stroke:n,...a},c)=>{const{colors:o}=j(),l=e&&e in o?o[e]:e,u=n&&n in o?o[n]:n;return s.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 32 32",width:16,height:16,fill:l,stroke:u,ref:c,...a,children:s.jsx("path",{d:"M16 2A11.013 11.013 0 0 0 5 13c0 9.413 10 16.521 10.426 16.819a1 1 0 0 0 1.148 0C17 29.52 27 22.413 27 13A11.01 11.01 0 0 0 16 2m0 7a4 4 0 1 1 0 8 4 4 0 0 1 0-8"})})};h.forwardRef(iv);const sv=({fill:e="currentColor",stroke:n,...a},c)=>{const{colors:o}=j(),l=e&&e in o?o[e]:e,u=n&&n in o?o[n]:n;return s.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 32 32",width:16,height:16,fill:l,stroke:u,ref:c,...a,children:s.jsx("path",{d:"M30 17v4a1 1 0 0 1-1.196.98L19.5 20.125v2.966l2.207 2.206A1 1 0 0 1 22 26v3a1 1 0 0 1-1.375.929L16 28.078l-4.625 1.85A1 1 0 0 1 10 29v-3a1 1 0 0 1 .293-.707l2.207-2.207v-2.961L3.196 21.98A1 1 0 0 1 2 21v-4a1 1 0 0 1 .553-.895l9.947-4.972V5.5a3.5 3.5 0 1 1 7 0v5.633l9.948 4.972A1 1 0 0 1 30 17"})})};h.forwardRef(sv);const cv=({fill:e="currentColor",stroke:n,...a},c)=>{const{colors:o}=j(),l=e&&e in o?o[e]:e,u=n&&n in o?o[n]:n;return s.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 32 32",width:16,height:16,fill:l,stroke:u,ref:c,...a,children:s.jsx("path",{d:"M25.676 18.884a7.6 7.6 0 0 1-3.978 1.107 9 9 0 0 1-3.42-.707A6.94 6.94 0 0 0 17 23.314V27a1 1 0 0 1-1.066 1A1.023 1.023 0 0 1 15 26.969v-1.555l-4.828-4.828A6.6 6.6 0 0 1 7.93 21a5.73 5.73 0 0 1-2.99-.834C2.216 18.511.75 14.702 1.034 9.974a1 1 0 0 1 .94-.94c4.728-.28 8.537 1.182 10.187 3.906a5.75 5.75 0 0 1 .806 3.56.5.5 0 0 1-.86.304l-2.4-2.513a1 1 0 0 0-1.415 1.414l6.736 6.906q.01-.146.026-.291a8.57 8.57 0 0 1 2.33-4.933l6.323-6.682a1 1 0 0 0-1.413-1.415l-6.125 6.477a.5.5 0 0 1-.848-.217c-.592-2.185-.331-4.36.8-6.228 2.233-3.685 7.428-5.657 13.898-5.277a1 1 0 0 1 .94.94c.375 6.471-1.598 11.666-5.283 13.899"})})};h.forwardRef(cv);const lv=({fill:e="currentColor",stroke:n,...a},c)=>{const{colors:o}=j(),l=e&&e in o?o[e]:e,u=n&&n in o?o[n]:n;return s.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 32 32",width:16,height:16,fill:l,stroke:u,ref:c,...a,children:s.jsx("path",{d:"M30 16a1.97 1.97 0 0 1-.95 1.689L11.04 28.706a2 2 0 0 1-2.767-.688A2 2 0 0 1 8 27.016V4.984a1.98 1.98 0 0 1 1.015-1.728 2 2 0 0 1 2.025.038L29.05 14.31A1.97 1.97 0 0 1 30 16"})})};h.forwardRef(lv);const uv=({fill:e="currentColor",stroke:n,...a},c)=>{const{colors:o}=j(),l=e&&e in o?o[e]:e,u=n&&n in o?o[n]:n;return s.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 32 32",width:16,height:16,fill:l,stroke:u,ref:c,...a,children:s.jsx("path",{d:"M28.5 16a1.5 1.5 0 0 1-1.5 1.5h-9.5V27a1.5 1.5 0 1 1-3 0v-9.5H5a1.5 1.5 0 1 1 0-3h9.5V5a1.5 1.5 0 1 1 3 0v9.5H27a1.5 1.5 0 0 1 1.5 1.5"})})},dv=h.forwardRef(uv),Tb=dv,hv=({fill:e="currentColor",stroke:n,...a},c)=>{const{colors:o}=j(),l=e&&e in o?o[e]:e,u=n&&n in o?o[n]:n;return s.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 32 32",width:16,height:16,fill:l,stroke:u,ref:c,...a,children:s.jsx("path",{d:"M16 3a13 13 0 1 0 13 13A13.016 13.016 0 0 0 16 3m5 14h-4v4a1 1 0 0 1-2 0v-4h-4a1 1 0 0 1 0-2h4v-4a1 1 0 0 1 2 0v4h4a1 1 0 0 1 0 2"})})};h.forwardRef(hv);const fv=({fill:e="currentColor",stroke:n,...a},c)=>{const{colors:o}=j(),l=e&&e in o?o[e]:e,u=n&&n in o?o[n]:n;return s.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 32 32",width:16,height:16,fill:l,stroke:u,ref:c,...a,children:s.jsx("path",{d:"M27 5H17V3a1 1 0 0 0-2 0v2H5a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h4.92l-2.701 3.375a1 1 0 0 0 1.562 1.25L12.48 24h7.04l3.699 4.625a1 1 0 1 0 1.562-1.25L22.08 24H27a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2M13 18a1 1 0 0 1-2 0v-3a1 1 0 0 1 2 0zm4 0a1 1 0 0 1-2 0v-5a1 1 0 0 1 2 0zm4 0a1 1 0 0 1-2 0v-7a1 1 0 0 1 2 0z"})})};h.forwardRef(fv);const gv=({fill:e="currentColor",stroke:n,...a},c)=>{const{colors:o}=j(),l=e&&e in o?o[e]:e,u=n&&n in o?o[n]:n;return s.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 32 32",width:16,height:16,fill:l,stroke:u,ref:c,...a,children:s.jsx("path",{d:"M30.414 17 18 4.586A1.98 1.98 0 0 0 16.586 4H5a1 1 0 0 0-1 1v11.586A1.98 1.98 0 0 0 4.586 18L17 30.414a2 2 0 0 0 2.829 0l10.585-10.585a2 2 0 0 0 0-2.829M10.5 12a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3"})})};h.forwardRef(gv);const wv=({fill:e="currentColor",stroke:n,...a},c)=>{const{colors:o}=j(),l=e&&e in o?o[e]:e,u=n&&n in o?o[n]:n;return s.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 32 32",width:16,height:16,fill:l,stroke:u,ref:c,...a,children:s.jsx("path",{d:"M20.723 28H26a2 2 0 0 0 2-2v-4.706a1 1 0 0 0-1.383-.919 2.9 2.9 0 0 1-1.117.221c-1.654 0-3-1.387-3-3.091s1.346-3.091 3-3.091c.383 0 .763.075 1.117.221A1 1 0 0 0 28 13.706V9a2 2 0 0 0-2-2h-4.527a4.5 4.5 0 1 0-8.945 0H8a2 2 0 0 0-2 2v4.028a4.5 4.5 0 1 0 0 8.945V26a2 2 0 0 0 2 2h5.278"})})};h.forwardRef(wv);const mv=({fill:e="currentColor",stroke:n,...a},c)=>{const{colors:o}=j(),l=e&&e in o?o[e]:e,u=n&&n in o?o[n]:n;return s.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 32 32",width:16,height:16,fill:l,stroke:u,ref:c,...a,children:s.jsx("path",{d:"M18 22.5a2 2 0 1 1-4 0 2 2 0 0 1 4 0M29.5 16A13.5 13.5 0 1 1 16 2.5 13.515 13.515 0 0 1 29.5 16m-3 0A10.5 10.5 0 1 0 16 26.5 10.51 10.51 0 0 0 26.5 16M16 8c-3.033 0-5.5 2.242-5.5 5v.5a1.5 1.5 0 1 0 3 0V13c0-1.102 1.125-2 2.5-2s2.5.898 2.5 2-1.125 2-2.5 2a1.5 1.5 0 0 0-1.5 1.5v1a1.5 1.5 0 0 0 2.966.32C19.79 17.235 21.5 15.296 21.5 13c0-2.758-2.468-5-5.5-5"})})};h.forwardRef(mv);const xv=({fill:e="currentColor",stroke:n,...a},c)=>{const{colors:o}=j(),l=e&&e in o?o[e]:e,u=n&&n in o?o[n]:n;return s.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 32 32",width:16,height:16,fill:l,stroke:u,ref:c,...a,children:s.jsx("path",{d:"M14.5 9v11a6.006 6.006 0 0 1-6 6 1 1 0 0 1 0-2 4 4 0 0 0 4-4v-1H5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h7.5a2 2 0 0 1 2 2M27 7h-7.5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2H27v1a4 4 0 0 1-4 4 1 1 0 0 0 0 2 6.006 6.006 0 0 0 6-6V9a2 2 0 0 0-2-2"})})};h.forwardRef(xv);const vv=({fill:e="currentColor",stroke:n,...a},c)=>{const{colors:o}=j(),l=e&&e in o?o[e]:e,u=n&&n in o?o[n]:n;return s.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 32 32",width:16,height:16,fill:l,stroke:u,ref:c,...a,children:s.jsx("path",{d:"M27 5v23a1 1 0 0 1-2 0v-6h-6a1 1 0 0 1-1-1c.046-2.395.349-4.779.902-7.11 1.223-5.061 3.54-8.454 6.704-9.809a1 1 0 0 1 1.394.92m-12.014-.164a.999.999 0 1 0-1.972.33L13.986 11H11V5a1 1 0 0 0-2 0v6H6.014l.972-5.835a1 1 0 1 0-1.972-.329l-1 6A1 1 0 0 0 4 11a6.01 6.01 0 0 0 5 5.915V28a1 1 0 1 0 2 0V16.915A6.01 6.01 0 0 0 16 11q0-.083-.014-.164z"})})};h.forwardRef(vv);const pv=({fill:e="currentColor",stroke:n,...a},c)=>{const{colors:o}=j(),l=e&&e in o?o[e]:e,u=n&&n in o?o[n]:n;return s.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 32 32",width:16,height:16,fill:l,stroke:u,ref:c,...a,children:s.jsx("path",{d:"M19 28a1 1 0 0 1-1 1h-4a1 1 0 0 1 0-2h4a1 1 0 0 1 1 1m8.953-8.521-1.546 6.954a2 2 0 0 1-3.188 1.138l-3.405-2.57h-7.625L8.78 27.57a2 2 0 0 1-3.189-1.138l-1.545-6.954a2.01 2.01 0 0 1 .415-1.714l3.57-4.282c.12-1.574.482-3.12 1.072-4.584 1.612-4.043 4.5-6.579 5.671-7.481a2 2 0 0 1 2.45 0c1.167.902 4.059 3.438 5.671 7.48.59 1.465.952 3.01 1.072 4.585l3.57 4.282a2.01 2.01 0 0 1 .415 1.714m-17.404 4.25q-2.014-3.666-2.445-7.209L6 19.045 7.545 26l.022-.016zM17.5 12.5a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0m8.5 6.545-2.104-2.525q-.428 3.535-2.445 7.211l2.982 2.25.022.017z"})})};h.forwardRef(pv);const bv=({fill:e="currentColor",stroke:n,...a},c)=>{const{colors:o}=j(),l=e&&e in o?o[e]:e,u=n&&n in o?o[n]:n;return s.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 32 32",width:16,height:16,fill:l,stroke:u,ref:c,...a,children:s.jsx("path",{d:"M19.716 14.141a1 1 0 0 1 .261-1.391l8.458-5.788a1 1 0 0 1 1.125 1.652L21.101 14.4a1 1 0 0 1-1.39-.261zm10.109 10.634a1 1 0 0 1-1.39.261L17 17.211l-5.315 3.636a4.5 4.5 0 1 1-1.125-1.65L15.229 16l-4.673-3.198a4.5 4.5 0 1 1 1.125-1.65l17.875 12.233a1 1 0 0 1 .269 1.39M9 22.5a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0m0-13a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0"})})};h.forwardRef(bv);const $v=({fill:e="currentColor",stroke:n,...a},c)=>{const{colors:o}=j(),l=e&&e in o?o[e]:e,u=n&&n in o?o[n]:n;return s.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 32 32",width:16,height:16,fill:l,stroke:u,ref:c,...a,children:s.jsx("path",{d:"M29.061 26.939 23.125 21A11.515 11.515 0 1 0 21 23.125l5.941 5.942a1.503 1.503 0 0 0 2.125-2.125zM5.5 14a8.5 8.5 0 1 1 8.5 8.5A8.51 8.51 0 0 1 5.5 14"})})},Cv=h.forwardRef($v),yv=Cv,Sv=({fill:e="currentColor",stroke:n,...a},c)=>{const{colors:o}=j(),l=e&&e in o?o[e]:e,u=n&&n in o?o[n]:n;return s.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 32 32",width:16,height:16,fill:l,stroke:u,ref:c,...a,children:s.jsx("path",{d:"M26 5H6a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h20a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2m-3.5 6.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3M26 17H6a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h20a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2m-3.5 6.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3"})})};h.forwardRef(Sv);const Rv=({fill:e="currentColor",stroke:n,...a},c)=>{const{colors:o}=j(),l=e&&e in o?o[e]:e,u=n&&n in o?o[n]:n;return s.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 32 32",width:16,height:16,fill:l,stroke:u,ref:c,...a,children:s.jsx("path",{d:"M28 7v7.346c0 11.202-9.477 14.918-11.375 15.549a1.94 1.94 0 0 1-1.25 0C13.475 29.264 4 25.548 4 14.346V7a2 2 0 0 1 2-2h20a2 2 0 0 1 2 2"})})};h.forwardRef(Rv);const _v=({fill:e="currentColor",stroke:n,...a},c)=>{const{colors:o}=j(),l=e&&e in o?o[e]:e,u=n&&n in o?o[n]:n;return s.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 32 32",width:16,height:16,fill:l,stroke:u,ref:c,...a,children:s.jsx("path",{d:"m30.949 7.653-6.47-3.528A1 1 0 0 0 24 4h-4a1 1 0 0 0-1 1 3 3 0 0 1-6 0 1 1 0 0 0-1-1H8a1 1 0 0 0-.48.125L1.051 7.653a1.97 1.97 0 0 0-.824 2.657l2.41 4.601A2.05 2.05 0 0 0 4.458 16H7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V16h2.543a2.05 2.05 0 0 0 1.822-1.089l2.409-4.601a1.97 1.97 0 0 0-.825-2.658M4.459 14a.08.08 0 0 1-.051-.016L2.01 9.408 7 6.685V14zm23.134-.018a.07.07 0 0 1-.052.018H25V6.685l4.99 2.723z"})})};h.forwardRef(_v);const jv=({fill:e="currentColor",stroke:n,...a},c)=>{const{colors:o}=j(),l=e&&e in o?o[e]:e,u=n&&n in o?o[n]:n;return s.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 32 32",width:16,height:16,fill:l,stroke:u,ref:c,...a,children:s.jsx("path",{d:"M12 27a2 2 0 1 1-4 0 2 2 0 0 1 4 0m11-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4m5.805-16.594A1 1 0 0 0 28 8H6.04L5.026 4.45A2.01 2.01 0 0 0 3.103 3H1a1 1 0 0 0 0 2h2.103l4.522 15.824A3.01 3.01 0 0 0 10.509 23h12.014a2.99 2.99 0 0 0 2.867-2.117l3.566-11.59a1 1 0 0 0-.151-.887"})})};h.forwardRef(jv);const Av=({fill:e="currentColor",stroke:n,...a},c)=>{const{colors:o}=j(),l=e&&e in o?o[e]:e,u=n&&n in o?o[n]:n;return s.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 32 32",width:16,height:16,fill:l,stroke:u,ref:c,...a,children:s.jsx("path",{d:"M14.5 27a1.5 1.5 0 0 1-1.5 1.5H6A2.5 2.5 0 0 1 3.5 26V6A2.5 2.5 0 0 1 6 3.5h7a1.5 1.5 0 0 1 0 3H6.5v19H13a1.5 1.5 0 0 1 1.5 1.5m13.561-12.061-5-5a1.503 1.503 0 0 0-2.125 2.125l2.439 2.436H13a1.5 1.5 0 1 0 0 3h10.375l-2.44 2.439a1.503 1.503 0 0 0 2.125 2.125l5-5a1.5 1.5 0 0 0 .001-2.125"})})};h.forwardRef(Av);const Iv=({fill:e="currentColor",stroke:n,...a},c)=>{const{colors:o}=j(),l=e&&e in o?o[e]:e,u=n&&n in o?o[n]:n;return s.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 32 32",width:16,height:16,fill:l,stroke:u,ref:c,...a,children:s.jsx("path",{d:"M4 10a1 1 0 0 1 1-1h4.646a3.5 3.5 0 0 1 6.708 0H27a1 1 0 1 1 0 2H16.354a3.5 3.5 0 0 1-6.708 0H5a1 1 0 0 1-1-1m23 11h-2.646a3.5 3.5 0 0 0-6.708 0H5a1 1 0 0 0 0 2h12.646a3.5 3.5 0 0 0 6.708 0H27a1 1 0 1 0 0-2"})})};h.forwardRef(Iv);const Tv=({fill:e="currentColor",stroke:n,...a},c)=>{const{colors:o}=j(),l=e&&e in o?o[e]:e,u=n&&n in o?o[n]:n;return s.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 32 32",width:16,height:16,fill:l,stroke:u,ref:c,...a,children:s.jsx("path",{d:"M26 18a1.97 1.97 0 0 1-1.302 1.867l-6.457 2.375-2.375 6.452a1.99 1.99 0 0 1-3.735 0L9.75 22.25l-6.452-2.375a1.99 1.99 0 0 1 0-3.735l6.456-2.375 2.375-6.451a1.99 1.99 0 0 1 3.735 0l2.375 6.456 6.451 2.375A1.97 1.97 0 0 1 26 18M19 6h2v2a1 1 0 0 0 2 0V6h2a1 1 0 1 0 0-2h-2V2a1 1 0 1 0-2 0v2h-2a1 1 0 1 0 0 2m11 4h-1V9a1 1 0 1 0-2 0v1h-1a1 1 0 0 0 0 2h1v1a1 1 0 0 0 2 0v-1h1a1 1 0 0 0 0-2"})})};h.forwardRef(Tv);const Mv=({fill:e="currentColor",stroke:n,...a},c)=>{const{colors:o}=j(),l=e&&e in o?o[e]:e,u=n&&n in o?o[n]:n;return s.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 32 32",width:16,height:16,fill:l,stroke:u,ref:c,...a,children:s.jsx("path",{d:"M15 7v6a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2m10-2h-6a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2M13 17H7a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2m12 0h-6a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2"})})};h.forwardRef(Mv);const Ev=({fill:e="currentColor",stroke:n,...a},c)=>{const{colors:o}=j(),l=e&&e in o?o[e]:e,u=n&&n in o?o[n]:n;return s.jsxs("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 32 32",width:16,height:16,fill:l,stroke:u,ref:c,...a,children:[s.jsx("path",{d:"M27.5 21.136 16 27.843 4.5 21.136a1 1 0 0 0-1 1.728l12 7a1 1 0 0 0 1.008 0l12-7a1 1 0 1 0-1.008-1.728"}),s.jsx("path",{d:"M27.5 15.136 16 21.843 4.5 15.136a1 1 0 0 0-1 1.728l12 7a1 1 0 0 0 1.008 0l12-7a1 1 0 1 0-1.008-1.728"}),s.jsx("path",{d:"m3.5 10.864 12 7a1 1 0 0 0 1.008 0l12-7a1 1 0 0 0 0-1.728l-12-7a1 1 0 0 0-1.008 0l-12 7a1 1 0 0 0 0 1.728"})]})};h.forwardRef(Ev);const Lv=({fill:e="currentColor",stroke:n,...a},c)=>{const{colors:o}=j(),l=e&&e in o?o[e]:e,u=n&&n in o?o[n]:n;return s.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 32 32",width:16,height:16,fill:l,stroke:u,ref:c,...a,children:s.jsx("path",{d:"m29.313 14.298-5.638 4.92 1.689 7.325a2 2 0 0 1-2.98 2.167l-6.389-3.875L9.62 28.71a2 2 0 0 1-2.98-2.168l1.686-7.317-5.638-4.928a2 2 0 0 1 1.138-3.507l7.433-.644 2.901-6.92a1.994 1.994 0 0 1 3.68 0l2.91 6.92 7.43.644a2 2 0 0 1 1.139 3.508z"})})};h.forwardRef(Lv);const Vv=({fill:e="currentColor",stroke:n,...a},c)=>{const{colors:o}=j(),l=e&&e in o?o[e]:e,u=n&&n in o?o[n]:n;return s.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 32 32",width:16,height:16,fill:l,stroke:u,ref:c,...a,children:s.jsx("path",{d:"M29 19a4 4 0 1 0-4.991 3.875A1 1 0 0 0 24 23a4 4 0 0 1-4 4h-3a4 4 0 0 1-4-4v-5.065c3.934-.5 7-3.934 7-8.039V5a2 2 0 0 0-2-2h-2a1 1 0 1 0 0 2h2v4.896c0 3.323-2.656 6.061-5.92 6.104A6 6 0 0 1 6 10V5h2a1 1 0 0 0 0-2H6a2 2 0 0 0-2 2v5a8 8 0 0 0 7 7.936V23a6.006 6.006 0 0 0 6 6h3a6.006 6.006 0 0 0 6-6 1 1 0 0 0-.009-.125A4 4 0 0 0 29 19m-4 1a1 1 0 1 1 0-2 1 1 0 0 1 0 2"})})};h.forwardRef(Vv);const Bv=({fill:e="currentColor",stroke:n,...a},c)=>{const{colors:o}=j(),l=e&&e in o?o[e]:e,u=n&&n in o?o[n]:n;return s.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 32 32",width:16,height:16,fill:l,stroke:u,ref:c,...a,children:s.jsx("path",{d:"M29 12a1 1 0 0 0-.038-.275L27.17 5.45A2.01 2.01 0 0 0 25.25 4H6.75a2.01 2.01 0 0 0-1.919 1.45L3.04 11.725A1 1 0 0 0 3 12v2a5 5 0 0 0 2 4v8a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2v-8a5 5 0 0 0 2-4zm-18 2a3 3 0 0 1-4.39 2.657 1 1 0 0 0-.228-.132A3 3 0 0 1 5 14v-1h6zm8 0a3 3 0 0 1-6 0v-1h6zm8 0a3 3 0 0 1-1.384 2.525q-.12.051-.225.131A3 3 0 0 1 21 14v-1h6z"})})};h.forwardRef(Bv);const Dv=({fill:e="currentColor",stroke:n,...a},c)=>{const{colors:o}=j(),l=e&&e in o?o[e]:e,u=n&&n in o?o[n]:n;return s.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 32 32",width:16,height:16,fill:l,stroke:u,ref:c,...a,children:s.jsx("path",{d:"M28.5 16a1.5 1.5 0 0 1-1.5 1.5h-3.767A5.19 5.19 0 0 1 24.5 21c0 1.806-.976 3.54-2.679 4.756C20.25 26.881 18.18 27.5 16 27.5s-4.25-.619-5.821-1.744C8.476 24.54 7.5 22.806 7.5 21a1.5 1.5 0 0 1 3 0c0 1.898 2.519 3.5 5.5 3.5s5.5-1.602 5.5-3.5c0-1.595-1.163-2.523-4.419-3.5H5a1.5 1.5 0 1 1 0-3h22a1.5 1.5 0 0 1 1.5 1.5M9.389 12.5a1.5 1.5 0 0 0 1.5-1.5c0-2 2.197-3.5 5.111-3.5 2.17 0 3.921.831 4.685 2.223a1.5 1.5 0 0 0 2.625-1.446C22.016 5.914 19.281 4.5 16 4.5c-4.625 0-8.111 2.794-8.111 6.5a1.5 1.5 0 0 0 1.5 1.5"})})};h.forwardRef(Dv);const Ov=({fill:e="currentColor",stroke:n,...a},c)=>{const{colors:o}=j(),l=e&&e in o?o[e]:e,u=n&&n in o?o[n]:n;return s.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 32 32",width:16,height:16,fill:l,stroke:u,ref:c,...a,children:s.jsx("path",{d:"M15 5V2a1 1 0 0 1 2 0v3a1 1 0 0 1-2 0m1 3a8 8 0 1 0 8 8 8.01 8.01 0 0 0-8-8m-8.707.707a1 1 0 1 0 1.414-1.415l-2-2a1 1 0 1 0-1.414 1.415zm0 14.586-2 2a1 1 0 1 0 1.414 1.415l2-2a1 1 0 1 0-1.415-1.415M24 9a1 1 0 0 0 .707-.293l2-2a1 1 0 0 0-1.415-1.414l-2 2A1 1 0 0 0 24 9m.707 14.293a1 1 0 1 0-1.415 1.415l2 2a1 1 0 0 0 1.415-1.415zM6 16a1 1 0 0 0-1-1H2a1 1 0 0 0 0 2h3a1 1 0 0 0 1-1m10 10a1 1 0 0 0-1 1v3a1 1 0 0 0 2 0v-3a1 1 0 0 0-1-1m14-11h-3a1 1 0 0 0 0 2h3a1 1 0 0 0 0-2"})})};h.forwardRef(Ov);const Hv=({fill:e="currentColor",stroke:n,...a},c)=>{const{colors:o}=j(),l=e&&e in o?o[e]:e,u=n&&n in o?o[n]:n;return s.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 32 32",width:16,height:16,fill:l,stroke:u,ref:c,...a,children:s.jsx("path",{d:"M27 8h-8.586l4.293-4.292a1 1 0 0 0-1.415-1.415L16 7.586l-5.292-5.293a1 1 0 1 0-1.415 1.415L13.586 8H5a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h22a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2m0 17h-7V10h7zm-2-10.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0 6a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0"})})};h.forwardRef(Hv);const Nv=({fill:e="currentColor",stroke:n,...a},c)=>{const{colors:o}=j(),l=e&&e in o?o[e]:e,u=n&&n in o?o[n]:n;return s.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 32 32",width:16,height:16,fill:l,stroke:u,ref:c,...a,children:s.jsx("path",{d:"m29.978 19.625-1.5-12A3 3 0 0 0 25.5 5H4a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h5.383l4.722 9.448A1 1 0 0 0 15 30a5 5 0 0 0 5-5v-2h7a3 3 0 0 0 2.977-3.375M9 18H4V7h5z"})})};h.forwardRef(Nv);const Fv=({fill:e="currentColor",stroke:n,...a},c)=>{const{colors:o}=j(),l=e&&e in o?o[e]:e,u=n&&n in o?o[n]:n;return s.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 32 32",width:16,height:16,fill:l,stroke:u,ref:c,...a,children:s.jsx("path",{d:"M29.25 10.015A3 3 0 0 0 27 9h-7V7a5 5 0 0 0-5-5 1 1 0 0 0-.895.553L9.383 12H4a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h21.5a3 3 0 0 0 2.977-2.625l1.5-12a3 3 0 0 0-.727-2.36M4 14h5v11H4z"})})};h.forwardRef(Fv);const zv=({fill:e="currentColor",stroke:n,...a},c)=>{const{colors:o}=j(),l=e&&e in o?o[e]:e,u=n&&n in o?o[n]:n;return s.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 32 32",width:16,height:16,fill:l,stroke:u,ref:c,...a,children:s.jsx("path",{d:"M23 3H9a4 4 0 0 0-4 4v16a4 4 0 0 0 4 4h1l-1.8 2.4a1 1 0 0 0 1.6 1.2l2.7-3.6h7l2.7 3.6a1 1 0 0 0 1.6-1.2L22 27h1a4 4 0 0 0 4-4V7a4 4 0 0 0-4-4M10.5 23a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m4.5-8H7v-5h8zm6.5 8a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m3.5-8h-8v-5h8z"})})};h.forwardRef(zv);const Wv=({fill:e="currentColor",stroke:n,...a},c)=>{const{colors:o}=j(),l=e&&e in o?o[e]:e,u=n&&n in o?o[n]:n;return s.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 32 32",width:16,height:16,fill:l,stroke:u,ref:c,...a,children:s.jsx("path",{d:"M27 6h-5V5a3 3 0 0 0-3-3h-6a3 3 0 0 0-3 3v1H5a1 1 0 0 0 0 2h1v18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8h1a1 1 0 1 0 0-2M14 21a1 1 0 0 1-2 0v-8a1 1 0 0 1 2 0zm6 0a1 1 0 0 1-2 0v-8a1 1 0 0 1 2 0zm0-15h-8V5a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1z"})})},kv=h.forwardRef(Wv),Mb=kv,Uv=({fill:e="currentColor",stroke:n,...a},c)=>{const{colors:o}=j(),l=e&&e in o?o[e]:e,u=n&&n in o?o[n]:n;return s.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 32 32",width:16,height:16,fill:l,stroke:u,ref:c,...a,children:s.jsx("path",{d:"m23.54 2.267-3.711 3.377c1.7.52 3.298 1.397 4.653 2.631 4.684 4.266 4.684 11.184 0 15.45q-5.184 4.72-16.021 6.008l3.71-3.377a12.2 12.2 0 0 1-4.653-2.63c-4.684-4.267-4.712-11.16 0-15.45q5.184-4.721 16.021-6.01m-7.54 8.4c-3.314 0-6 2.388-6 5.333s2.686 5.333 6 5.333 6-2.387 6-5.333c0-2.945-2.686-5.333-6-5.333"})})};h.forwardRef(Uv);const qv=({fill:e="currentColor",stroke:n,...a},c)=>{const{colors:o}=j(),l=e&&e in o?o[e]:e,u=n&&n in o?o[n]:n;return s.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 32 32",width:16,height:16,fill:l,stroke:u,ref:c,...a,children:s.jsx("path",{d:"M25.5 28a1.5 1.5 0 0 1-1.5 1.5H8a1.5 1.5 0 1 1 0-3h16a1.5 1.5 0 0 1 1.5 1.5M16 24.5a8.51 8.51 0 0 0 8.5-8.5V7a1.5 1.5 0 1 0-3 0v9a5.5 5.5 0 0 1-11 0V7a1.5 1.5 0 1 0-3 0v9a8.51 8.51 0 0 0 8.5 8.5"})})};h.forwardRef(qv);const Gv=({fill:e="currentColor",stroke:n,...a},c)=>{const{colors:o}=j(),l=e&&e in o?o[e]:e,u=n&&n in o?o[n]:n;return s.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 32 32",width:16,height:16,fill:l,stroke:u,ref:c,...a,children:s.jsx("path",{d:"M28.5 19v7a2.5 2.5 0 0 1-2.5 2.5H6A2.5 2.5 0 0 1 3.5 26v-7a1.5 1.5 0 0 1 3 0v6.5h19V19a1.5 1.5 0 1 1 3 0m-16.439-7.939L14.5 8.625V19a1.5 1.5 0 1 0 3 0V8.625l2.439 2.44a1.503 1.503 0 0 0 2.125-2.125l-5-5a1.5 1.5 0 0 0-2.125 0l-5 5a1.503 1.503 0 1 0 2.125 2.125z"})})};h.forwardRef(Gv);const Kv=({fill:e="currentColor",stroke:n,...a},c)=>{const{colors:o}=j(),l=e&&e in o?o[e]:e,u=n&&n in o?o[n]:n;return s.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 32 32",width:16,height:16,fill:l,stroke:u,ref:c,...a,children:s.jsx("path",{d:"M28.866 27.5A1 1 0 0 1 28 28H4a1 1 0 0 1-.865-1.5c1.904-3.291 4.838-5.651 8.261-6.77a9 9 0 1 1 9.208 0c3.424 1.119 6.357 3.479 8.261 6.77a1 1 0 0 1 .001 1"})})};h.forwardRef(Kv);const Yv=({fill:e="currentColor",stroke:n,...a},c)=>{const{colors:o}=j(),l=e&&e in o?o[e]:e,u=n&&n in o?o[n]:n;return s.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 32 32",width:16,height:16,fill:l,stroke:u,ref:c,...a,children:s.jsx("path",{d:"M19.44 3.101a1 1 0 0 0-1.054.11L9.656 10H4a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h5.656l8.73 6.789A1 1 0 0 0 20 28V4a1 1 0 0 0-.56-.899M28.414 16l2.293-2.292a1.001 1.001 0 0 0-1.415-1.415L27 14.586l-2.293-2.293a1 1 0 1 0-1.415 1.415L25.587 16l-2.293 2.293a1 1 0 0 0 1.415 1.415L27 17.414l2.293 2.294a1 1 0 0 0 1.415-1.415z"})})};h.forwardRef(Yv);const Zv=({fill:e="currentColor",stroke:n,...a},c)=>{const{colors:o}=j(),l=e&&e in o?o[e]:e,u=n&&n in o?o[n]:n;return s.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 32 32",width:16,height:16,fill:l,stroke:u,ref:c,...a,children:s.jsx("path",{d:"M19.439 3.101a1 1 0 0 0-1.053.11L9.656 10H4a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h5.656l8.73 6.789A1.001 1.001 0 0 0 20 28V4a1 1 0 0 0-.561-.899M9 20H4v-8h5zm15.75-7.305a5 5 0 0 1 0 6.61 1 1 0 0 1-1.5-1.322 3 3 0 0 0 0-3.966 1 1 0 0 1 1.5-1.322M31 16a10 10 0 0 1-2.546 6.668 1 1 0 0 1-1.49-1.334 8 8 0 0 0 0-10.666.998.998 0 0 1 .407-1.624 1 1 0 0 1 1.083.29A9.98 9.98 0 0 1 31 16"})})};h.forwardRef(Zv);const Xv=({fill:e="currentColor",stroke:n,...a},c)=>{const{colors:o}=j(),l=e&&e in o?o[e]:e,u=n&&n in o?o[n]:n;return s.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 32 32",width:16,height:16,fill:l,stroke:u,ref:c,...a,children:s.jsx("path",{d:"M15 6a4 4 0 1 1 8 0 4 4 0 0 1-8 0m11 11c-3.58 0-5.226-1.662-6.969-3.421a25 25 0 0 0-1.375-1.323C13.031 8.24 5.63 15.098 5.316 15.391a1 1 0 0 0 1.369 1.458 20.5 20.5 0 0 1 3.815-2.724c1.723-.922 3.174-1.279 4.338-1.072L8.082 28.6a1 1 0 0 0 1.835.798l4.2-9.659L18 22.515V29a1 1 0 1 0 2 0v-7a1 1 0 0 0-.419-.814l-4.65-3.321L16.61 14c.33.305.657.634 1 .98C19.381 16.774 21.586 19 26 19a1 1 0 0 0 0-2"})})};h.forwardRef(Xv);const Qv=({fill:e="currentColor",stroke:n,...a},c)=>{const{colors:o}=j(),l=e&&e in o?o[e]:e,u=n&&n in o?o[n]:n;return s.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 32 32",width:16,height:16,fill:l,stroke:u,ref:c,...a,children:s.jsx("path",{d:"M16 3a13 13 0 1 0 13 13A13.013 13.013 0 0 0 16 3m-1 7a1 1 0 0 1 2 0v7a1 1 0 0 1-2 0zm1 13a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3"})})},Jv=h.forwardRef(Qv),Pv=Jv,ep=({fill:e="currentColor",stroke:n,...a},c)=>{const{colors:o}=j(),l=e&&e in o?o[e]:e,u=n&&n in o?o[n]:n;return s.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 32 32",width:16,height:16,fill:l,stroke:u,ref:c,...a,children:s.jsx("path",{d:"m31.316 24.949-3 1a1 1 0 0 1-1.211-.5l-3.724-7.45H13a1 1 0 0 1-1-1v-3.707A7 7 0 0 0 14 27c3.239 0 6.261-2.256 7.031-5.25a1 1 0 1 1 1.938.5C21.96 26.162 18.19 29 14 29a9 9 0 0 1-2-17.774V8.851a3.5 3.5 0 1 1 2 0V11h7a1 1 0 0 1 0 2h-7v3h10a1 1 0 0 1 .894.552l3.612 7.225 2.178-.726a1 1 0 1 1 .632 1.898"})})};h.forwardRef(ep);const Br=(e,n)=>{const a=h.createContext(n),c=l=>{const{children:u,...m}=l,v=h.useMemo(()=>m,Object.values(m));return s.jsx(a.Provider,{value:v,children:u})};function o(l){const u=h.useContext(a);if(u)return u;if(n!==void 0)return n;throw new Error(`\`${l}\` must be used within \`${e}\``)}return c.displayName=`${e}Provider`,[c,o]};function tp(e,n){return typeof e=="string"?!1:n in e}function Mo(e,n,a){return e&&n&&tp(e,n)?e[n]:a}const Z1={padding:["padding-block-start","padding-inline-end","padding-block-end","padding-inline-start"],paddingTop:"padding-block-start",paddingRight:"padding-inline-end",paddingBottom:"padding-block-end",paddingLeft:"padding-inline-start",margin:["margin-block-start","margin-inline-end","margin-block-end","margin-inline-start"],marginLeft:"margin-inline-start",marginRight:"margin-inline-end",marginTop:"margin-block-start",marginBottom:"margin-block-end",borderRadius:"border-radius",borderStyle:"border-style",borderWidth:"border-width",borderColor:"border-color",fontSize:"font-size",fontWeight:"font-weight",lineHeight:"line-height",zIndex:"z-index",boxShadow:"box-shadow",pointerEvents:"pointer-events",textAlign:"text-align",textTransform:"text-transform",textDecoration:"text-decoration",flexGrow:"flex-grow",flexShrink:"flex-shrink",flexBasis:"flex-basis",minWidth:"min-width",maxWidth:"max-width",minHeight:"min-height",maxHeight:"max-height",flexDirection:"flex-direction",flexWrap:"flex-wrap",justifyContent:"justify-content",alignItems:"align-items"},np=e=>{const[n,a,c,o]=e,l=a??n;return[n,l,c??n,o??l]};function rp(e,n){switch(e){case"gap":case"padding":case"margin":case"paddingTop":case"paddingLeft":case"paddingRight":case"paddingBottom":case"marginTop":case"marginLeft":case"marginRight":case"marginBottom":case"left":case"right":case"top":case"bottom":case"width":case"maxWidth":case"minWidth":case"height":case"maxHeight":case"minHeight":case"borderRadius":case"borderWidth":return n.spaces;case"color":case"background":case"borderColor":return n.colors;case"fontSize":return n.fontSizes;case"fontWeight":return n.fontWeights;case"lineHeight":return n.lineHeights;case"zIndex":return n.zIndices;case"boxShadow":return n.shadows;default:return null}}const Ho=(e,n)=>{const a=Object.entries(e).reduce((c,o)=>{const[l,u]=o,m=rp(l,n),v=Object.prototype.hasOwnProperty.call(Z1,l)?Z1[l]:l;return v&&(u||u===0)&&(typeof u=="object"&&!Array.isArray(u)?Object.entries(u).forEach(([R,C])=>{c[R]={...c[R],...X1(v,C,m)}}):c.initial={...c.initial,...X1(v,u,m)}),c},{initial:{},small:{},medium:{},large:{}});return Object.entries(a).reduce((c,[o,l])=>{if(l&&Object.keys(l).length>0){const u=Object.entries(l).reduce((m,[v,R])=>(m.push(`${v}: ${R};`),m),[]).join(`
`);o==="initial"?c.push(u):c.push(`${n.breakpoints[o]}{ ${u} }`)}return c},[]).join(`
`)},X1=(e,n,a)=>{if(Array.isArray(e)&&Array.isArray(n)){const c=np(n);return e.reduce((o,l,u)=>(o[l]=Mo(a,c[u],c[u]),o),{})}else return Array.isArray(e)&&!Array.isArray(n)?e.reduce((c,o)=>(c[o]=Mo(a,n,n),c),{}):!Array.isArray(e)&&!Array.isArray(n)?{[e]:Mo(a,n,n)}:(console.warn("You've passed an array of values to a property that does not support it. Please check the property and value you're passing."),{})},ht=h.forwardRef,Z=ht((e,n)=>{const{background:a,basis:c,borderColor:o,color:l,flex:u,fontSize:m,grow:v,hasRadius:R,padding:C,paddingBottom:y,paddingLeft:b,paddingRight:A,paddingTop:T,margin:M,marginLeft:V,marginBottom:L,marginRight:_,marginTop:D,shadow:N,shrink:z,lineHeight:X,fontWeight:q,width:de,minWidth:ie,maxWidth:se,height:$e,minHeight:ne,maxHeight:P,top:ee,left:_e,bottom:je,right:we,borderRadius:ye,borderStyle:Me,borderWidth:Be,tag:he,pointerEvents:Je,display:me,position:ze,zIndex:Ne,overflow:Ye,cursor:K,transition:xe,transform:Se,animation:oe,textAlign:ge,textTransform:Ce,...rt}=e,Ee=he||"div",Ae={$background:a,$basis:c,$borderColor:o,$color:l,$flex:u,$fontSize:m,$grow:v,$hasRadius:R,$padding:C,$paddingBottom:y,$paddingLeft:b,$paddingRight:A,$paddingTop:T,$margin:M,$marginLeft:V,$marginBottom:L,$marginRight:_,$marginTop:D,$shadow:N,$shrink:z,$lineHeight:X,$fontWeight:q,$width:de,$minWidth:ie,$maxWidth:se,$height:$e,$minHeight:ne,$maxHeight:P,$top:ee,$left:_e,$bottom:je,$right:we,$borderRadius:ye,$borderStyle:Me,$borderWidth:Be,$pointerEvents:Je,$display:me,$position:ze,$zIndex:Ne,$overflow:Ye,$cursor:K,$transition:xe,$transform:Se,$animation:oe,$textAlign:ge,$textTransform:Ce};return s.jsx(op,{as:Ee,ref:n,...Ae,...rt})}),op=I.div`
  ${({theme:e,...n})=>Ho({padding:n.$padding,paddingTop:n.$paddingTop,paddingBottom:n.$paddingBottom,paddingLeft:n.$paddingLeft,paddingRight:n.$paddingRight,margin:n.$margin,marginTop:n.$marginTop,marginBottom:n.$marginBottom,marginLeft:n.$marginLeft,marginRight:n.$marginRight,top:n.$top,left:n.$left,bottom:n.$bottom,right:n.$right,width:n.$width,minWidth:n.$minWidth,maxWidth:n.$maxWidth,height:n.$height,minHeight:n.$minHeight,maxHeight:n.$maxHeight,color:n.$color,background:n.$background,fontSize:n.$fontSize,fontWeight:n.$fontWeight,lineHeight:n.$lineHeight,borderRadius:n.$hasRadius?e.borderRadius:n.$borderRadius,borderStyle:n.$borderColor&&!n.$borderStyle?"solid":n.$borderStyle,borderWidth:n.$borderColor&&!n.$borderWidth?"1px":n.$borderWidth,borderColor:n.$borderColor,zIndex:n.$zIndex,boxShadow:n.$shadow,display:n.$display,pointerEvents:n.$pointerEvents,cursor:n.$cursor,textAlign:n.$textAlign,textTransform:n.$textTransform,transition:n.$transition,transform:n.$transform,animation:n.$animation,position:n.$position,overflow:n.$overflow,flex:n.$flex,flexShrink:n.$shrink,flexGrow:n.$grow,flexBasis:n.$basis},e)};
`,G=ht((e,n)=>{const{className:a,alignItems:c,direction:o,inline:l,gap:u,justifyContent:m,wrap:v,...R}=e,C={$alignItems:c,$direction:o,$gap:u,$justifyContent:m,$wrap:v,$inline:l};return s.jsx(ap,{className:a,ref:n,...C,...R})}),ap=I(Z)`
  ${({theme:e,$display:n="flex",$alignItems:a="center",$direction:c="row",...o})=>Ho({gap:o.$gap,alignItems:a,justifyContent:o.$justifyContent,flexWrap:o.$wrap,flexDirection:c,display:o.$inline?"inline-flex":n},e)};
`,ip="alpha",sp="beta",cp="delta",lp="epsilon",Q1="omega",up="pi",dp="sigma",wl=te`
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`,hp=({$variant:e=Q1,theme:n})=>{switch(e){case ip:return`
        font-weight: ${n.fontWeights.bold};
        font-size: ${n.fontSizes[5]};
        line-height: ${n.lineHeights[2]};
      `;case sp:return`
        font-weight: ${n.fontWeights.bold};
        font-size: ${n.fontSizes[4]};
        line-height: ${n.lineHeights[1]};
      `;case cp:return`
        font-weight: ${n.fontWeights.semiBold};
        font-size: ${n.fontSizes[3]};
        line-height: ${n.lineHeights[2]};
      `;case lp:return`
        font-size: ${n.fontSizes[3]};
        line-height: ${n.lineHeights[6]};
      `;case Q1:return`
        font-size: ${n.fontSizes[2]};
        line-height: ${n.lineHeights[4]};
      `;case up:return`
        font-size: ${n.fontSizes[1]};
        line-height: ${n.lineHeights[3]};
      `;case dp:return`
        font-weight: ${n.fontWeights.bold};
        font-size: ${n.fontSizes[0]};
        line-height: ${n.lineHeights[5]};
        text-transform: uppercase;
      `;default:return`
        font-size: ${n.fontSizes[2]};
      `}},le=ht((e,n)=>{const{ellipsis:a,textColor:c="currentcolor",textDecoration:o,textTransform:l,variant:u,lineHeight:m,fontWeight:v,fontSize:R,...C}=e,y={$ellipsis:a,$textColor:c,$textDecoration:o,$textTransform:l,$variant:u,$lineHeight:m,$fontWeight:v,$fontSize:R};return s.jsx(fp,{ref:n,tag:"span",...y,...C})}),fp=I(Z)`
  ${hp}
  ${({$ellipsis:e})=>e?wl:""}

  ${({theme:e,...n})=>Ho({color:n.$textColor,textDecoration:n.$textDecoration,textTransform:n.$textTransform,lineHeight:n.$lineHeight,fontWeight:n.$fontWeight,fontSize:n.$fontSize},e)}
`,[gp,ci]=Br("Accordion"),wp=h.forwardRef(({children:e,size:n="S",...a},c)=>s.jsx(mp,{ref:c,$size:n,collapsible:!0,...a,type:"single",children:s.jsx(gp,{size:n,children:e})})),mp=I(w6)`
  background-color: ${e=>e.theme.colors.neutral0};

  ${e=>e.$size==="S"?te`
        border-radius: ${n=>n.theme.borderRadius};
        border: solid 1px ${n=>n.theme.colors.neutral200};
      `:te``}
`,xp=h.forwardRef((e,n)=>{const{size:a}=ci("Item");return s.jsx(vp,{$size:a,"data-size":a,ref:n,...e})}),vp=I(m6)`
  overflow: hidden;
  margin: 1px 0;

  &:first-child {
    border-top-left-radius: 0.3rem;
    border-top-right-radius: 0.3rem;
    margin-top: 0;
  }

  &:last-child {
    border-bottom-left-radius: 0.3rem;
    border-bottom-right-radius: 0.3rem;
    margin-bottom: 0;
  }

  &[data-size='S'] {
    & + & {
      border-top: solid 1px ${e=>e.theme.colors.neutral200};
    }
  }

  &[data-state='open'] {
    box-shadow: 0 0 0 1px ${e=>e.theme.colors.primary600};
  }

  &:not([data-disabled]):hover {
    box-shadow: 0 0 0 1px ${e=>e.theme.colors.primary600};
  }

  /* This applies our desired focus effect correctly. */
  &:focus-within {
    position: relative;
    z-index: 1;
    box-shadow: 0 0 0 1px ${e=>e.theme.colors.primary600};
  }

  @media (prefers-reduced-motion: no-preference) {
    transition: box-shadow ${e=>e.theme.motion.timings[120]}
      ${e=>e.theme.motion.easings.easeOutQuad};
  }
`,pp=h.forwardRef(({caretPosition:e="left",description:n,icon:a,children:c,...o},l)=>{const{size:u}=ci("Trigger");return s.jsxs(xl,{$caretPosition:e,$size:u,ref:l,...o,children:[e==="left"?s.jsx(Lo,{$size:u,children:s.jsx(Vn,{width:u==="S"?"1.2rem":"1.6rem",height:u==="S"?"1.2rem":"1.6rem"})}):null,s.jsxs(G,{tag:"span",gap:2,children:[a&&u==="S"?s.jsx(ml,{children:s.jsx(a,{})}):null,s.jsxs(G,{alignItems:"flex-start",direction:"column",tag:"span",ref:l,children:[s.jsx(le,{fontWeight:u==="S"?"bold":void 0,ellipsis:!0,variant:u==="M"?"delta":void 0,textAlign:"left",children:c}),n&&u==="M"?s.jsx(le,{textAlign:"left",children:n}):null]})]}),e==="right"?s.jsx(Lo,{$size:u,children:s.jsx(Vn,{width:u==="S"?"1.2rem":"1.6rem",height:u==="S"?"1.2rem":"1.6rem"})}):null]})}),ml=I(Z)`
  color: ${e=>e.theme.colors.neutral500};
  display: flex;

  @media (prefers-reduced-motion: no-preference) {
    transition: ${e=>e.theme.transitions.color};
  }
`,Lo=I(G).attrs(e=>({...e,tag:"span"}))`
  background-color: ${e=>e.theme.colors.neutral200};
  width: ${e=>e.$size==="S"?"2.4rem":"3.2rem"};
  height: ${e=>e.$size==="S"?"2.4rem":"3.2rem"};
  flex: ${e=>e.$size==="S"?"0 0 2.4rem":"0 0 3.2rem"};
  border-radius: 50%;
  justify-content: center;

  @media (prefers-reduced-motion: no-preference) {
    transition:
      transform ${e=>e.theme.motion.timings[200]} ${e=>e.theme.motion.easings.authenticMotion},
      ${e=>e.theme.transitions.backgroundColor};
  }
`,xl=I(g6)`
  display: flex;
  align-items: center;
  justify-content: ${e=>e.$caretPosition==="left"?"flex-start":"space-between"};
  width: 100%;
  gap: ${e=>e.theme.spaces[4]};
  padding-inline: ${e=>e.$size==="S"?e.theme.spaces[4]:e.theme.spaces[6]};
  padding-block: ${e=>e.$size==="S"?e.theme.spaces[3]:e.theme.spaces[6]};
  cursor: pointer;
  color: ${e=>e.theme.colors.neutral800};

  &[data-disabled] {
    cursor: default;
    color: ${e=>e.theme.colors.neutral600};
  }

  &[data-state='open'] > ${Lo} {
    transform: rotate(180deg);
  }

  /* we remove the default focus because the entire item should have the focus style and the default would be hidden. */
  &:focus-visible {
    outline: none;
  }

  @media (prefers-reduced-motion: no-preference) {
    transition: ${e=>e.theme.transitions.color};
  }
`,bp=h.forwardRef((e,n)=>{const{size:a}=ci("Trigger");return s.jsx(vl,{$size:a,...e,ref:n})}),vl=I(G).attrs(e=>({...e,tag:"span"}))`
  padding-inline: ${e=>e.$size==="S"?e.theme.spaces[2]:e.theme.spaces[6]};
  padding-block: ${e=>e.$size==="S"?e.theme.spaces[2]:e.theme.spaces[6]};

  // Remove default IconButton styles so there are no backgrounds or borders.
  & > button {
    border: none;
    background: none;
    color: ${e=>e.theme.colors.neutral600};

    @media (prefers-reduced-motion: no-preference) {
      transition: ${e=>e.theme.transitions.color};
    }
  }
`,$p=h.forwardRef(({variant:e="primary",...n},a)=>s.jsx(Cp,{$variant:e,ref:a,...n})),Cp=I(x6)`
  display: flex;
  align-items: center;
  background-color: ${e=>e.$variant==="primary"?e.theme.colors.neutral0:e.theme.colors.neutral100};

  &[data-disabled] {
    background-color: ${e=>e.theme.colors.neutral150};
  }

  &:not([data-disabled]) {
    &:hover,
    &[data-state='open'] {
      background-color: ${e=>e.theme.colors.primary100};

      & > ${xl} {
        color: ${e=>e.theme.colors.primary600};

        & ${ml} {
          color: ${e=>e.theme.colors.primary600};
        }

        & ${Lo} {
          background-color: ${e=>e.theme.colors.primary200};
        }
      }

      & > ${vl} > button {
        color: ${e=>e.theme.colors.primary600};
      }
    }
  }

  @media (prefers-reduced-motion: no-preference) {
    transition: ${e=>e.theme.transitions.backgroundColor};
  }
`,yp=h.forwardRef((e,n)=>s.jsx(_p,{ref:n,...e})),Sp=it`
  from {
    height: 0;
  }
  to {
    height: var(--radix-accordion-content-height);
  }
`,Rp=it`
  from {
    height: var(--radix-accordion-content-height);
  }
  to {
    height: 0;
  }
`,_p=I(v6)`
  overflow: hidden;

  @media (prefers-reduced-motion: no-preference) {
    &[data-state='open'] {
      animation: ${Sp} ${e=>e.theme.motion.timings[320]}
        ${e=>e.theme.motion.easings.authenticMotion};
    }

    &[data-state='closed'] {
      animation: ${Rp} ${e=>e.theme.motion.timings[320]}
        ${e=>e.theme.motion.easings.authenticMotion};
    }
  }
`,Eb=Object.freeze(Object.defineProperty({__proto__:null,Actions:bp,Content:yp,Header:$p,Item:xp,Root:wp,Trigger:pp},Symbol.toStringTag,{value:"Module"})),No=te`
  position: relative;
  outline: none;

  &:after {
    transition-property: all;
    transition-duration: 0.2s;
    border-radius: 8px;
    content: '';
    position: absolute;
    top: -4px;
    bottom: -4px;
    left: -4px;
    right: -4px;
    border: 2px solid transparent;
  }

  &:focus-visible {
    outline: none;

    &:after {
      border-radius: 8px;
      content: '';
      position: absolute;
      top: -5px;
      bottom: -5px;
      left: -5px;
      right: -5px;
      border: 2px solid ${e=>e.theme.colors.primary600};
    }
  }
`,sr=({tag:e,...n})=>{const a=e||"span";return s.jsx(jp,{...n,as:a})},jp=I.span`
  border: 0;
  clip: rect(0 0 0 0);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  width: 1px;
`,nr=({children:e,label:n})=>{const a=h.Children.only(e);return s.jsxs(s.Fragment,{children:[h.cloneElement(a,{"aria-hidden":"true",focusable:"false"}),s.jsx(sr,{children:n})]})};nr.displayName="AccessibleIcon";const pl=e=>{switch(e){case"danger":return"danger100";case"success":return"success100";case"warning":return"warning100";default:return"primary100"}},Ap=e=>pl(e).replace("100","200"),Aa=({theme:e,$variant:n})=>n==="danger"?e.colors.danger700:n==="success"?e.colors.success700:n==="warning"?e.colors.warning700:e.colors.primary700,Ip=I(Z)`
  ${No};
`,Tp=I(G)`
  svg {
    height: 100%;
    width: 100%;

    path {
      fill: ${Aa};
    }
  }
`,Mp=({variant:e,...n})=>e==="success"?s.jsx(em,{...n}):e==="danger"||e==="warning"?s.jsx(Pv,{...n}):s.jsx(vx,{...n}),Ep=I(Z)`
  & a > span {
    color: ${Aa};
  }

  svg path {
    fill: ${Aa};
  }
`,Lb=({title:e,children:n,variant:a="default",onClose:c,closeLabel:o,titleAs:l="p",action:u,...m})=>s.jsxs(G,{alignItems:"flex-start",background:pl(a),borderColor:Ap(a),shadow:"filterShadow",gap:3,hasRadius:!0,padding:5,paddingRight:6,...m,children:[s.jsx(Tp,{height:"2rem",shrink:0,$variant:a,width:"2rem",children:s.jsx(Mp,{"aria-hidden":!0,variant:a})}),s.jsxs(G,{alignItems:"start",gap:u?2:1,wrap:"wrap",role:a==="danger"?"alert":"status",width:"100%",children:[e&&s.jsx(le,{fontWeight:"bold",textColor:"neutral800",tag:l,children:e}),s.jsx(le,{tag:"p",textColor:"neutral800",children:n}),u&&s.jsx(Ep,{$variant:a,children:u})]}),s.jsx(Ip,{tag:"button",background:"transparent",borderColor:void 0,height:"1.6rem",width:"1.6rem",marginTop:1,onClick:c,color:"neutral700",children:s.jsx(nr,{label:o,children:s.jsx(On,{})})})]});function bl(e){const n=h.useRef(e);return h.useEffect(()=>{n.current=e}),h.useMemo(()=>(...a)=>{var c;return(c=n.current)===null||c===void 0?void 0:c.call(n,...a)},[])}function Kt({prop:e,defaultProp:n,onChange:a=()=>{}}){const[c,o]=$l({defaultProp:n,onChange:a}),l=e!==void 0,u=l?e:c,m=bl(a),v=h.useCallback(R=>{if(l){const y=typeof R=="function"?R(e):R;y!==e&&m(y)}else o(R)},[l,e,o,m]);return[u,v]}function $l({defaultProp:e,onChange:n}){const a=h.useState(e),[c]=a,o=h.useRef(c),l=bl(n);return h.useEffect(()=>{o.current!==c&&(l(c),o.current=c)},[c,o,l]),a}const J1={easeOutQuad:"cubic-bezier(0.25, 0.46, 0.45, 0.94)"},P1={120:"120ms"};`${P1[120]}${J1.easeOutQuad}`,`${P1[120]}${J1.easeOutQuad}`;const qe={overlayFadeIn:it`
    from {
      opacity: 0;
    }
    to {
      opacity: 0.2;
    }
  `,modalPopIn:it`
    from {
      transform:translate(-50%, -50%)  scale(0.8);
      opacity: 0;
    }
    to {
      transform: translate(-50%, -50%) scale(1);
      opacity: 1;
    }
  `,modalPopOut:it`
    from {
      transform: translate(-50%, -50%) scale(1);
      opacity: 1;
    }
    to {
      transform:translate(-50%, -50%)  scale(0.8);
      opacity: 0;
    }
  `,popIn:it`
    from {
      transform: scale(0.8);
      opacity: 0;
    }
    to {
      transform: scale(1);
      opacity: 1;
    }
  `,popOut:it`
    from {
      transform: scale(1);
      opacity: 1;
    }
    to {
      transform: scale(0.8);
      opacity: 0;
    }
  `,slideDownIn:it`
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  `,slideDownOut:it`
    from {
      opacity: 1;
      transform: translateY(0);
    }
    to {
      opacity: 0;
      transform: translateY(-10px);
    }
  `,slideUpIn:it`
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  `,slideUpOut:it`
    from {
      opacity: 1;
      transform: translateY(0);
    }
    to {
      opacity: 0;
      transform: translateY(10px);
    }
  `,fadeIn:it`
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  `,fadeOut:it`
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  `},Mr=32,ec=2;h.forwardRef(({onLoadingStatusChange:e,delayMs:n=600,src:a,alt:c,fallback:o,preview:l=!1,...u},m)=>{const[v,R]=Kt({onChange:e}),[C,y]=h.useState(!1),b=l&&v==="loaded",A=T=>{b&&y(T)};return s.jsxs(Rc,{onOpenChange:A,children:[s.jsx(_c,{asChild:!0,children:s.jsxs(Ia,{ref:m,...u,children:[b?s.jsx(Lp,{width:"100%",height:"100%",position:"absolute",background:"neutral0",zIndex:"overlay",style:{opacity:C?.4:0}}):null,s.jsx(Vp,{src:a,alt:c,onLoadingStatusChange:R}),s.jsx($6,{delayMs:n,children:s.jsx(le,{fontWeight:"bold",textTransform:"uppercase",children:o})})]})}),b?s.jsx(jc,{children:s.jsx(Bp,{side:"top",sideOffset:4,children:s.jsx(Dp,{src:a,alt:c})})}):null]})});const Cl=te`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  vertical-align: middle;
  overflow: hidden;
  user-select: none;
  overflow: hidden;
  border-radius: 50%;
`,yl=te`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: inherit;
`,Ia=I(C6)`
  position: relative;
  z-index: 0;
  ${Cl}
  width: ${Mr/10}rem;
  height: ${Mr/10}rem;
  /* TODO: we should get the user email & hash it to turn it into a hex-value so different emails can consistently get a different background */
  background-color: ${e=>e.theme.colors.primary600};
  color: ${e=>e.theme.colors.neutral0};
`,Lp=I(Z)`
  @media (prefers-reduced-motion: no-preference) {
    transition: opacity ${e=>e.theme.motion.timings[200]}
      ${e=>e.theme.motion.easings.authenticMotion};
  }
`,Vp=I(y6)`
  ${yl}
`,Bp=I(Ac)`
  ${Cl}
  width: ${Mr*ec/10}rem;
  height: ${Mr*ec/10}rem;

  @media (prefers-reduced-motion: no-preference) {
    animation: ${qe.fadeIn} ${e=>e.theme.motion.timings[200]}
      ${e=>e.theme.motion.easings.authenticMotion};
  }
`,Dp=I.img`
  ${yl}
`;h.forwardRef((e,n)=>s.jsx(Op,{...e,ref:n,tag:"div"}));const Op=I(G)`
  & > ${Ia} + ${Ia} {
    margin-left: -${Mr/10/2}rem;
  }
`,Hp=({active:e=!1,size:n="M",textColor:a="neutral600",backgroundColor:c="neutral150",children:o,minWidth:l=5,...u})=>{const m=n==="S"?1:2;return s.jsx(Np,{inline:!0,alignItems:"center",justifyContent:"center",minWidth:l,paddingLeft:m,paddingRight:m,background:e?"primary200":c,$size:n,...u,children:s.jsx(le,{variant:"sigma",textColor:e?"primary600":a,lineHeight:"1rem",children:o})})},Np=I(G)`
  border-radius: ${({theme:e,$size:n})=>n==="S"?"2px":e.borderRadius};
  ${({$size:e,theme:n})=>e==="S"?te`
        padding-block: 0.3rem;
        padding-inline ${n.spaces[1]}
      `:te`
      padding-block: 0.7rem;
      padding-inline ${n.spaces[2]}
    `};
`,Dr=ht(({href:e,disabled:n=!1,isExternal:a=!1,...c},o)=>s.jsx(Fp,{tag:"a",ref:o,target:a?"_blank":void 0,rel:a?"noreferrer noopener":void 0,href:e,tabIndex:n?-1:void 0,"aria-disabled":n,pointerEvents:n?"none":void 0,cursor:n?void 0:"pointer",...c})),Fp=I(Z)`
  text-decoration: none;

  &:visited {
    color: inherit;
  }
`,Sl=()=>s.jsx(Z,{"aria-hidden":!0,paddingLeft:1,paddingRight:1,children:s.jsx(le,{variant:"pi",textColor:"neutral500",children:"/"})});Sl.displayName="Divider";const zp=I(G)`
  // CrumbLinks do have padding-x, because they need to have a
  // interaction effect, which mis-aligns the breadcrumbs on the left.
  // This normalizes the behavior by moving the first item to left by
  // the same amount it has inner padding
  & > *:first-child {
    margin-left: ${({theme:e})=>`calc(-1*${e.spaces[2]})`};
  }
`,Wp=h.forwardRef(({label:e,children:n,...a},c)=>{const o=h.Children.toArray(n);return s.jsx(Z,{"aria-label":e,tag:"nav",...a,ref:c,children:s.jsx(zp,{tag:"ol",children:h.Children.map(o,(l,u)=>{const m=o.length>1&&u+1<o.length;return s.jsxs(G,{inline:!0,tag:"li",children:[l,m&&s.jsx(Sl,{})]})})})})});Wp.displayName="Breadcrumbs";const kp=h.forwardRef(({children:e,isCurrent:n=!1,...a},c)=>s.jsx(Z,{paddingLeft:2,paddingRight:2,paddingTop:1,paddingBottom:1,ref:c,children:s.jsx(le,{variant:"pi",textColor:"neutral800",fontWeight:n?"bold":"regular","aria-current":n,...a,children:e})}));kp.displayName="Crumb";const Up=I(Dr)`
  border-radius: ${({theme:e})=>e.borderRadius};
  color: ${({theme:e})=>e.colors.neutral600};
  font-size: ${({theme:e})=>e.fontSizes[1]};
  line-height: ${({theme:e})=>e.lineHeights[4]};
  padding: ${({theme:e})=>`${e.spaces[1]} ${e.spaces[2]}`};
  text-decoration: none;

  :hover,
  :focus {
    background-color: ${({theme:e})=>e.colors.neutral200};
    color: ${({theme:e})=>e.colors.neutral700};
  }
`,qp=h.forwardRef(({children:e,...n},a)=>s.jsx(Up,{ref:a,...n,children:e}));qp.displayName="CrumbLink";const rr=e=>e.replaceAll(":","");function Gp(e,n){typeof e=="function"?e(n):e!=null&&(e.current=n)}function Rl(...e){return n=>e.forEach(a=>Gp(a,n))}function xt(...e){return h.useCallback(Rl(...e),e)}const Kp=()=>typeof window>"u"||!window.navigator||/ServerSideRendering|^Deno\//.test(window.navigator.userAgent),or=Kp()?h.useEffect:h.useLayoutEffect,Yp=l6.useId||(()=>{});let Zp=0;const Wt=e=>{const[n,a]=h.useState(Yp());return or(()=>{e||a(c=>c??String(Zp++))},[e]),e?.toString()??(n||"")},Or=(e,n,{selectorToWatch:a,skipWhen:c=!1})=>{const o=Wa(n);h.useEffect(()=>{if(c||!e.current)return;const l={root:e.current,rootMargin:"0px"},u=R=>{R.forEach(C=>{C.isIntersecting&&e.current&&e.current.scrollHeight>e.current.clientHeight&&o(C)})},m=new IntersectionObserver(u,l),v=e.current.querySelector(a);return v&&m.observe(v),()=>{m.disconnect()}},[c,o,a,e])},li="success-light",ui="danger-light",Fo="default",Hr="tertiary",Nr="secondary",_l="danger",jl="success",zo="ghost",di=[li,ui],Xp=[Fo,Hr,Nr,_l,jl,zo,...di],Qp=["S","M","L"],Nt=e=>e===li||e===ui?`${e.substring(0,e.lastIndexOf("-"))}`:e===Hr?"neutral":e===Fo||e===Nr||Xp.every(n=>n!==e)?"primary":`${e}`,Al=({theme:e})=>te`
    border: 1px solid ${e.colors.neutral200};
    background: ${e.colors.neutral150};
    color: ${e.colors.neutral600};
    cursor: default;
  `,Il=({theme:e,$variant:n})=>[...di,Nr].includes(n)?te`
      background-color: ${e.colors.neutral0};
    `:n===Hr?te`
      background-color: ${e.colors.neutral100};
    `:n===zo?te`
      background-color: ${e.colors.neutral100};
    `:n===Fo?te`
      border: 1px solid ${e.colors.buttonPrimary500};
      background: ${e.colors.buttonPrimary500};
    `:te`
    border: 1px solid ${e.colors[`${Nt(n)}500`]};
    background: ${e.colors[`${Nt(n)}500`]};
  `,Tl=({theme:e,$variant:n})=>[...di,Nr].includes(n)?te`
      background-color: ${e.colors.neutral0};
      border: 1px solid ${e.colors[`${Nt(n)}600`]};
      color: ${e.colors[`${Nt(n)}600`]};
    `:n===Hr||n===zo?te`
      background-color: ${e.colors.neutral150};
    `:te`
    border: 1px solid ${e.colors[`${Nt(n)}600`]};
    background: ${e.colors[`${Nt(n)}600`]};
  `,Ml=({theme:e,$variant:n})=>{switch(n){case ui:case li:case Nr:return te`
        border: 1px solid ${e.colors[`${Nt(n)}200`]};
        background: ${e.colors[`${Nt(n)}100`]};
        color: ${e.colors[`${Nt(n)}700`]};
      `;case Hr:return te`
        border: 1px solid ${e.colors.neutral200};
        background: ${e.colors.neutral0};
        color: ${e.colors.neutral800};
      `;case zo:return te`
        border: 1px solid transparent;
        background: transparent;
        color: ${e.colors.neutral800};

        svg {
          fill: ${e.colors.neutral500};
        }
      `;case jl:case _l:return te`
        border: 1px solid ${e.colors[`${Nt(n)}600`]};
        background: ${e.colors[`${Nt(n)}600`]};
        color: ${e.colors.neutral0};
      `;default:return te`
        border: 1px solid ${e.colors.buttonPrimary600};
        background: ${e.colors.buttonPrimary600};
        color: ${e.colors.buttonNeutral0};
      `}},Ta=ht(({variant:e=Fo,startIcon:n,endIcon:a,disabled:c=!1,children:o,onClick:l,size:u=Qp[0],loading:m=!1,fullWidth:v=!1,...R},C)=>{const y=c||m,b=A=>{!y&&l&&l(A)};return s.jsxs(e7,{ref:C,"aria-disabled":y,disabled:y,$size:u,$variant:e,tag:"button",onClick:b,hasRadius:!0,gap:2,inline:!0,alignItems:"center",justifyContent:"center",width:v?"100%":void 0,paddingLeft:4,paddingRight:4,cursor:"pointer",...R,children:[(n||m)&&s.jsx(G,{tag:"span","aria-hidden":!0,children:m?s.jsx(Pp,{}):n}),s.jsx(le,{variant:u==="S"?"pi":void 0,fontWeight:"bold",children:o}),a&&s.jsx(G,{tag:"span","aria-hidden":!0,children:a})]})}),Jp=it`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(359deg);
  }
`,Pp=I(gl)`
  animation: ${Jp} 2s infinite linear;
  will-change: transform;
`,e7=I(G)`
  height: ${({theme:e,$size:n})=>e.sizes.button[n]};
  text-decoration: none;
  ${Ml}

  &:hover {
    ${Il}
  }

  &:active {
    ${Tl}
  }

  &[aria-disabled='true'] {
    ${Al}
  }

  @media (prefers-reduced-motion: no-preference) {
    transition:
      ${e=>e.theme.transitions.backgroundColor},
      ${e=>e.theme.transitions.color},
      border-color ${e=>e.theme.motion.timings[200]} ${e=>e.theme.motion.easings.easeOutQuad};
  }
`,El=h.forwardRef(({children:e,description:n,label:a,defaultOpen:c,open:o,onOpenChange:l,delayDuration:u=500,disableHoverableContent:m,...v},R)=>s.jsxs(Rc,{defaultOpen:c,open:o,onOpenChange:l,delayDuration:u,disableHoverableContent:m,children:[s.jsx(_c,{asChild:!0,children:e}),s.jsx(jc,{children:s.jsx(t7,{ref:R,sideOffset:8,...v,children:s.jsx(le,{variant:"pi",fontWeight:"bold",children:a||n})})})]})),t7=I(Ac)`
  background-color: ${e=>e.theme.colors.neutral900};
  color: ${e=>e.theme.colors.neutral0};
  padding-inline: ${e=>e.theme.spaces[2]};
  padding-block: ${e=>e.theme.spaces[2]};
  border-radius: ${e=>e.theme.borderRadius};
  z-index: ${e=>e.theme.zIndices.tooltip};
  will-change: opacity;
  transform-origin: var(--radix-tooltip-content-transform-origin);

  @media (prefers-reduced-motion: no-preference) {
    animation: ${qe.fadeIn} ${e=>e.theme.motion.timings[200]}
      ${e=>e.theme.motion.easings.authenticMotion};
  }
`,Ma=ht(({label:e,background:n,children:a,disabled:c=!1,onClick:o,size:l="S",variant:u="tertiary",withTooltip:m=!0,...v},R)=>{const C=b=>{!c&&o&&o(b)},y=s.jsx(Tr,{"aria-disabled":c,background:c?"neutral150":n,tag:"button",display:"inline-flex",justifyContent:"center",hasRadius:!0,cursor:"pointer",...v,ref:R,$size:l,onClick:C,$variant:u,children:s.jsx(nr,{label:e,children:a})});return m?s.jsx(El,{label:e,children:y}):y}),Tr=I(G)`
  text-decoration: none;

  ${e=>{switch(e.$size){case"S":return te`
          padding-block: 0.7rem;
          padding-inline: 0.7rem;
        `;case"M":return te`
          padding-block: 0.9rem;
          padding-inline: 0.9rem;
        `;case"L":return te`
          padding-block: 1.1rem;
          padding-inline: 1.1rem;
        `}}}
  ${Ml}
  ${e=>e.$variant==="tertiary"?te`
          color: ${e.theme.colors.neutral500};
        `:""}

  &:hover {
    ${Il}
    ${e=>e.$variant==="tertiary"?te`
            color: ${e.theme.colors.neutral600};
          `:""}
  }

  &:active {
    ${Tl}
  }

  &[aria-disabled='true'] {
    ${Al}
  }

  @media (prefers-reduced-motion: no-preference) {
    transition:
      ${e=>e.theme.transitions.backgroundColor},
      ${e=>e.theme.transitions.color},
      border-color ${e=>e.theme.motion.timings[200]} ${e=>e.theme.motion.easings.easeOutQuad};
  }
`;I(G)`
  & ${Tr}:first-child {
    border-radius: ${({theme:e})=>`${e.borderRadius} 0 0 ${e.borderRadius}`};
  }

  & ${Tr}:last-child {
    border-radius: ${({theme:e})=>`0 ${e.borderRadius} ${e.borderRadius} 0`};
  }

  & ${Tr} {
    border-radius: 0;

    & + ${Tr} {
      border-left: none;
    }
  }
`;const n7=ht(({children:e,href:n,disabled:a=!1,startIcon:c,endIcon:o,isExternal:l=!1,...u},m)=>s.jsxs(r7,{ref:m,href:n,disabled:a,isExternal:l,...u,children:[c,s.jsx(le,{textColor:a?"neutral600":"primary600",children:e}),o,n&&!o&&l&&s.jsx(Om,{})]})),r7=I(Dr)`
  display: inline-flex;
  align-items: center;
  text-decoration: none;
  gap: ${({theme:e})=>e.spaces[2]};
  pointer-events: ${({disabled:e})=>e?"none":void 0};

  svg {
    font-size: 1rem;

    path {
      fill: ${({disabled:e,theme:n})=>e?n.colors.neutral600:n.colors.primary600};
    }
  }

  &:hover {
    & > span {
      color: ${({theme:e})=>e.colors.primary500};
    }
  }

  &:active {
    color: ${({theme:e})=>e.colors.primary700};
  }

  ${No};
`,o7=I6,a7=h.forwardRef(({label:e,endIcon:n=s.jsx(Vn,{width:"1.2rem",height:"1.2rem","aria-hidden":!0}),tag:a=Ta,icon:c,...o},l)=>{const u={...o,ref:l,type:"button"};return s.jsx(S6,{asChild:!0,children:a===Ma?s.jsx(Ma,{label:e,variant:"tertiary",...u,children:c}):s.jsx(Ta,{endIcon:n,variant:"ghost",...u})})}),i7=h.forwardRef(({children:e,intersectionId:n,popoverPlacement:a="bottom-start",...c},o)=>{const[l,u]=a.split("-");return s.jsx(Ic,{children:s.jsx(s7,{align:u,side:l,loop:!0,asChild:!0,children:s.jsxs(Ll,{ref:o,direction:"column",borderColor:"neutral150",hasRadius:!0,background:"neutral0",shadow:"filterShadow",maxHeight:"15rem",padding:1,marginTop:1,marginBottom:1,alignItems:"flex-start",position:"relative",overflow:"auto",...c,children:[e,s.jsx(Z,{id:n,width:"100%",height:"1px"})]})})})}),Ll=I(G)`
  scrollbar-width: none;
  -ms-overflow-style: none;
  -webkit-overflow-scrolling: touch;

  &::-webkit-scrollbar {
    display: none;
  }
`,s7=I(R6)`
  @media (prefers-reduced-motion: no-preference) {
    animation-duration: ${e=>e.theme.motion.timings[200]};

    &[data-state='open'] {
      animation-timing-function: ${e=>e.theme.motion.easings.authenticMotion};

      &[data-side='top'] {
        animation-name: ${qe.slideUpIn};
      }

      &[data-side='bottom'] {
        animation-name: ${qe.slideDownIn};
      }
    }
  }
`,Vl=({theme:e})=>te`
  text-align: left;
  width: 100%;
  border-radius: ${e.borderRadius};
  padding: ${e.spaces[2]} ${e.spaces[4]};

  &[aria-disabled='true'] {
    cursor: not-allowed;
    color: ${e.colors.neutral500};
  }

  &[data-highlighted] {
    background-color: ${e.colors.primary100};
  }

  &:focus-visible {
    outline: none;

    &:after {
      content: none;
    }
  }
`,c7=I(G)`
  ${Vl}
`;I(n7)`
  /* We include this here again because typically when people use OptionLink they provide an as prop which cancels the Box props */
  color: ${({theme:e,color:n})=>Mo(e.colors,n,void 0)};
  text-decoration: none;

  &:hover {
    color: unset;
  }

  /* TODO: do we need this? */
  svg > path,
  &:focus-visible svg > path {
    fill: currentColor;
  }

  ${Vl}
`;h.forwardRef((e,n)=>s.jsx(_6,{asChild:!0,children:s.jsx(l7,{ref:n,variant:"sigma",textColor:"neutral600",...e})}));const l7=I(le)`
  padding: ${({theme:e})=>e.spaces[2]} ${({theme:e})=>e.spaces[4]};
`;h.forwardRef(({disabled:e=!1,...n},a)=>s.jsx(j6,{asChild:!0,disabled:e,children:s.jsxs(u7,{ref:a,color:"neutral800",tag:"button",type:"button",background:"transparent",borderStyle:"none",gap:5,...n,children:[s.jsx(le,{children:n.children}),s.jsx(si,{fill:"neutral500",height:"1.2rem",width:"1.2rem"})]})}));const u7=I(c7)`
  &[data-state='open'] {
    background-color: ${({theme:e})=>e.colors.primary100};
  }
`;h.forwardRef((e,n)=>s.jsx(Ic,{children:s.jsx(A6,{sideOffset:8,asChild:!0,children:s.jsx(Ll,{ref:n,direction:"column",borderStyle:"solid",borderWidth:"1px",borderColor:"neutral150",hasRadius:!0,background:"neutral0",shadow:"filterShadow",maxHeight:"15rem",padding:1,alignItems:"flex-start",overflow:"auto",...e})})}));const d7=o7,h7=a7,f7=i7,g7=h.forwardRef(({children:e,onOpen:n,onClose:a,popoverPlacement:c,onReachEnd:o,...l},u)=>{const m=h.useRef(null),v=xt(u,m),R=h.useRef(null),[C,y]=h.useState(!1),b=V=>{o&&o(V)},A=V=>{V&&typeof n=="function"?n():!V&&typeof a=="function"&&a(),y(V)},T=Wt(),M=`intersection-${rr(T)}`;return Or(R,b,{selectorToWatch:`#${M}`,skipWhen:!C}),s.jsxs(d7,{onOpenChange:A,children:[s.jsx(h7,{ref:v,...l,children:l.label}),s.jsx(f7,{ref:R,intersectionId:M,popoverPlacement:c,children:e})]})}),w7=I(g7)`
  padding: ${({theme:e})=>`${e.spaces[1]} ${e.spaces[2]}`};
  height: unset;

  :hover,
  :focus {
    background-color: ${({theme:e})=>e.colors.neutral200};
  }
`,m7=h.forwardRef(({children:e,...n},a)=>s.jsx(w7,{ref:a,endIcon:null,size:"S",...n,children:e}));m7.displayName="CrumbSimpleMenu";const Bl=h.createContext({id:""}),x7=()=>h.useContext(Bl);h.forwardRef(({id:e,...n},a)=>{const c=Wt(e),o=h.useMemo(()=>({id:c}),[c]);return s.jsx(Bl.Provider,{value:o,children:s.jsx(Z,{ref:a,id:e,tabIndex:0,hasRadius:!0,background:"neutral0",borderStyle:"solid",borderWidth:"1px",borderColor:"neutral150",shadow:"tableShadow",tag:"article","aria-labelledby":`${c}-title`,...n})})});const v7=h.forwardRef(({position:e,...n},a)=>s.jsx(p7,{ref:a,$position:e,...n,direction:"row",gap:2})),p7=I(G)`
  position: absolute;
  top: ${({theme:e})=>e.spaces[3]};
  right: ${({$position:e,theme:n})=>{if(e==="end")return n.spaces[3]}};
  left: ${({$position:e,theme:n})=>{if(e==="start")return n.spaces[3]}};
`;I.img`
  // inline flows is based on typography and displays an extra white space below the image
  // switch to block is required in order to make the img stick the bottom of the container
  // addition infos: https://stackoverflow.com/questions/5804256/image-inside-div-has-extra-space-below-the-image
  margin: 0;
  padding: 0;
  max-height: 100%;
  max-width: 100%;
  object-fit: contain;
`;I.div`
  display: flex;
  justify-content: center;
  height: ${({$size:e})=>e==="S"?"8.8rem":"16.4rem"};
  width: 100%;
  background: repeating-conic-gradient(${({theme:e})=>e.colors.neutral100} 0% 25%, transparent 0% 50%) 50% / 20px
    20px;
  border-top-left-radius: ${({theme:e})=>e.borderRadius};
  border-top-right-radius: ${({theme:e})=>e.borderRadius};
`;I.div`
  margin-left: auto;
  flex-shrink: 0;
`;I(Hp)`
  margin-left: ${({theme:e})=>e.spaces[1]};
`;const b7=({fill:e,...n})=>{const{colors:a}=j();return s.jsx(Z,{tag:"svg",viewBox:"0 0 32 32",xmlns:"http://www.w3.org/2000/svg",fill:e?a[e]:void 0,...n,children:s.jsx("path",{d:"M29.0613 10.0613L13.0613 26.0613C12.9219 26.2011 12.7563 26.3121 12.574 26.3878C12.3917 26.4635 12.1962 26.5024 11.9988 26.5024C11.8013 26.5024 11.6059 26.4635 11.4235 26.3878C11.2412 26.3121 11.0756 26.2011 10.9363 26.0613L3.93626 19.0613C3.79673 18.9217 3.68605 18.7561 3.61053 18.5738C3.53502 18.3915 3.49615 18.1961 3.49615 17.9988C3.49615 17.8014 3.53502 17.606 3.61053 17.4237C3.68605 17.2414 3.79673 17.0758 3.93626 16.9363C4.07579 16.7967 4.24143 16.686 4.42374 16.6105C4.60604 16.535 4.80143 16.4962 4.99876 16.4962C5.19608 16.4962 5.39147 16.535 5.57378 16.6105C5.75608 16.686 5.92173 16.7967 6.06126 16.9363L12 22.875L26.9388 7.93876C27.2205 7.65697 27.6027 7.49866 28.0013 7.49866C28.3998 7.49866 28.782 7.65697 29.0638 7.93876C29.3455 8.22055 29.5039 8.60274 29.5039 9.00126C29.5039 9.39977 29.3455 9.78197 29.0638 10.0638L29.0613 10.0613Z"})})},tc=h.forwardRef(({defaultChecked:e,checked:n,onCheckedChange:a,...c},o)=>{const l=h.useRef(null),[u,m]=Kt({defaultProp:e,prop:n,onChange:a}),v=xt(l,o);return s.jsx($7,{ref:v,checked:u,onCheckedChange:m,...c,children:s.jsxs(p6,{style:{display:"inline-flex"},children:[u===!0?s.jsx(b7,{width:"1.6rem",fill:"neutral0"}):null,u==="indeterminate"?s.jsx(Nx,{fill:"neutral0"}):null]})})}),$7=I(b6)`
  background: ${e=>e.theme.colors.neutral0};
  width: 2rem;
  height: 2rem;
  border-radius: ${e=>e.theme.borderRadius};
  border: 1px solid ${e=>e.theme.colors.neutral300};
  position: relative;
  z-index: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  // this ensures the checkbox is always a square even in flex-containers.
  flex: 0 0 2rem;

  &[data-state='checked'],
  &[data-state='indeterminate'] {
    border: 1px solid ${e=>e.theme.colors.primary600};
    background-color: ${e=>e.theme.colors.primary600};
  }

  &[data-disabled] {
    background-color: ${e=>e.theme.colors.neutral200};
  }

  /* increase target size for touch devices https://www.w3.org/WAI/WCAG21/Understanding/target-size.html */
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    height: 100%;
    min-width: 44px;
    min-height: 44px;
  }
`,hi=h.forwardRef(({children:e,...n},a)=>{const c=Wt(n.id);return e?s.jsxs(G,{gap:2,children:[s.jsx(tc,{id:c,...n}),s.jsx(le,{tag:"label",textColor:"neutral800",htmlFor:c,children:e})]}):s.jsx(tc,{ref:a,...n})});h.forwardRef((e,n)=>{const{id:a}=x7();return s.jsx(v7,{position:"start",children:s.jsx(hi,{"aria-labelledby":`${a}-title`,...e,ref:n})})});I(Z)`
  word-break: break-all;
`;I(G)`
  border-bottom: 1px solid ${({theme:e})=>e.colors.neutral150};
`;const st={DOWN:"ArrowDown",UP:"ArrowUp",RIGHT:"ArrowRight",LEFT:"ArrowLeft",ESCAPE:"Escape",ENTER:"Enter",END:"End",HOME:"Home",PAGE_UP:"PageUp",PAGE_DOWN:"PageDown"},C7=I(Z)`
  grid-template-columns: auto 1fr auto;
  grid-template-areas: 'startAction slides endAction';
`,y7=I(G)`
  grid-area: slides;
`,nc=I(Z)`
  grid-area: ${({$area:e})=>e};

  &:focus svg path,
  &:hover svg path {
    fill: ${({theme:e})=>e.colors.neutral900};
  }
`,S7=h.forwardRef(({actions:e,children:n,label:a,nextLabel:c,onNext:o,onPrevious:l,previousLabel:u,secondaryLabel:m,selectedSlide:v,...R},C)=>{const y=h.useRef(null),b=h.useRef(null),A=h.Children.map(n,(M,V)=>h.cloneElement(M,{selected:V===v})),T=M=>{switch(M.key){case st.RIGHT:{M.preventDefault(),b?.current&&b.current.focus(),o&&o();break}case st.LEFT:{M.preventDefault(),y?.current&&y.current.focus(),l&&l();break}}};return s.jsx(Z,{ref:C,...R,onKeyDown:T,children:s.jsxs(Z,{padding:2,borderColor:"neutral200",hasRadius:!0,background:"neutral100",children:[s.jsxs(C7,{tag:"section","aria-roledescription":"carousel","aria-label":a,display:"grid",position:"relative",children:[A&&A.length>1&&s.jsxs(s.Fragment,{children:[s.jsx(nc,{tag:"button",onClick:l,$area:"startAction",ref:y,type:"button",children:s.jsx(nr,{label:u,children:s.jsx(fl,{width:"1.6rem",height:"1.6rem",fill:"neutral600"})})}),s.jsx(nc,{tag:"button",onClick:o,$area:"endAction",ref:b,type:"button",children:s.jsx(nr,{label:c,children:s.jsx(si,{width:"1.6rem",height:"1.6rem",fill:"neutral600"})})})]}),s.jsx(y7,{"aria-live":"polite",paddingLeft:2,paddingRight:2,width:"100%",overflow:"hidden",children:A}),e]}),m&&s.jsx(Z,{paddingTop:2,paddingLeft:4,paddingRight:4,children:s.jsx(El,{label:m,children:s.jsx(G,{justifyContent:"center",children:s.jsx(le,{variant:"pi",textColor:"neutral600",ellipsis:!0,children:m})})})})]})})});var _r=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{},Vo={exports:{}};/**
 * @license
 * Lodash <https://lodash.com/>
 * Copyright OpenJS Foundation and other contributors <https://openjsf.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */Vo.exports;(function(e,n){(function(){var a,c="4.17.21",o=200,l="Unsupported core-js use. Try https://npms.io/search?q=ponyfill.",u="Expected a function",m="Invalid `variable` option passed into `_.template`",v="__lodash_hash_undefined__",R=500,C="__lodash_placeholder__",y=1,b=2,A=4,T=1,M=2,V=1,L=2,_=4,D=8,N=16,z=32,X=64,q=128,de=256,ie=512,se=30,$e="...",ne=800,P=16,ee=1,_e=2,je=3,we=1/0,ye=9007199254740991,Me=17976931348623157e292,Be=NaN,he=4294967295,Je=he-1,me=he>>>1,ze=[["ary",q],["bind",V],["bindKey",L],["curry",D],["curryRight",N],["flip",ie],["partial",z],["partialRight",X],["rearg",de]],Ne="[object Arguments]",Ye="[object Array]",K="[object AsyncFunction]",xe="[object Boolean]",Se="[object Date]",oe="[object DOMException]",ge="[object Error]",Ce="[object Function]",rt="[object GeneratorFunction]",Ee="[object Map]",Ae="[object Number]",_t="[object Null]",Ze="[object Object]",lr="[object Promise]",Uo="[object Proxy]",ln="[object RegExp]",ct="[object Set]",kt="[object String]",Hn="[object Symbol]",ur="[object Undefined]",$n="[object WeakMap]",qo="[object WeakSet]",Zt="[object ArrayBuffer]",Ge="[object DataView]",Go="[object Float32Array]",Ko="[object Float64Array]",Yo="[object Int8Array]",Zo="[object Int16Array]",Xo="[object Int32Array]",Qo="[object Uint8Array]",Jo="[object Uint8ClampedArray]",Po="[object Uint16Array]",e0="[object Uint32Array]",c2=/\b__p \+= '';/g,l2=/\b(__p \+=) '' \+/g,u2=/(__e\(.*?\)|\b__t\)) \+\n'';/g,vi=/&(?:amp|lt|gt|quot|#39);/g,pi=/[&<>"']/g,d2=RegExp(vi.source),h2=RegExp(pi.source),f2=/<%-([\s\S]+?)%>/g,g2=/<%([\s\S]+?)%>/g,bi=/<%=([\s\S]+?)%>/g,w2=/\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,m2=/^\w*$/,x2=/[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g,t0=/[\\^$.*+?()[\]{}|]/g,v2=RegExp(t0.source),n0=/^\s+/,p2=/\s/,b2=/\{(?:\n\/\* \[wrapped with .+\] \*\/)?\n?/,$2=/\{\n\/\* \[wrapped with (.+)\] \*/,C2=/,? & /,y2=/[^\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]+/g,S2=/[()=,{}\[\]\/\s]/,R2=/\\(\\)?/g,_2=/\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g,$i=/\w*$/,j2=/^[-+]0x[0-9a-f]+$/i,A2=/^0b[01]+$/i,I2=/^\[object .+?Constructor\]$/,T2=/^0o[0-7]+$/i,M2=/^(?:0|[1-9]\d*)$/,E2=/[\xc0-\xd6\xd8-\xf6\xf8-\xff\u0100-\u017f]/g,Fr=/($^)/,L2=/['\n\r\u2028\u2029\\]/g,zr="\\ud800-\\udfff",V2="\\u0300-\\u036f",B2="\\ufe20-\\ufe2f",D2="\\u20d0-\\u20ff",Ci=V2+B2+D2,yi="\\u2700-\\u27bf",Si="a-z\\xdf-\\xf6\\xf8-\\xff",O2="\\xac\\xb1\\xd7\\xf7",H2="\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf",N2="\\u2000-\\u206f",F2=" \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000",Ri="A-Z\\xc0-\\xd6\\xd8-\\xde",_i="\\ufe0e\\ufe0f",ji=O2+H2+N2+F2,r0="['’]",z2="["+zr+"]",Ai="["+ji+"]",Wr="["+Ci+"]",Ii="\\d+",W2="["+yi+"]",Ti="["+Si+"]",Mi="[^"+zr+ji+Ii+yi+Si+Ri+"]",o0="\\ud83c[\\udffb-\\udfff]",k2="(?:"+Wr+"|"+o0+")",Ei="[^"+zr+"]",a0="(?:\\ud83c[\\udde6-\\uddff]){2}",i0="[\\ud800-\\udbff][\\udc00-\\udfff]",Nn="["+Ri+"]",Li="\\u200d",Vi="(?:"+Ti+"|"+Mi+")",U2="(?:"+Nn+"|"+Mi+")",Bi="(?:"+r0+"(?:d|ll|m|re|s|t|ve))?",Di="(?:"+r0+"(?:D|LL|M|RE|S|T|VE))?",Oi=k2+"?",Hi="["+_i+"]?",q2="(?:"+Li+"(?:"+[Ei,a0,i0].join("|")+")"+Hi+Oi+")*",G2="\\d*(?:1st|2nd|3rd|(?![123])\\dth)(?=\\b|[A-Z_])",K2="\\d*(?:1ST|2ND|3RD|(?![123])\\dTH)(?=\\b|[a-z_])",Ni=Hi+Oi+q2,Y2="(?:"+[W2,a0,i0].join("|")+")"+Ni,Z2="(?:"+[Ei+Wr+"?",Wr,a0,i0,z2].join("|")+")",X2=RegExp(r0,"g"),Q2=RegExp(Wr,"g"),s0=RegExp(o0+"(?="+o0+")|"+Z2+Ni,"g"),J2=RegExp([Nn+"?"+Ti+"+"+Bi+"(?="+[Ai,Nn,"$"].join("|")+")",U2+"+"+Di+"(?="+[Ai,Nn+Vi,"$"].join("|")+")",Nn+"?"+Vi+"+"+Bi,Nn+"+"+Di,K2,G2,Ii,Y2].join("|"),"g"),P2=RegExp("["+Li+zr+Ci+_i+"]"),eu=/[a-z][A-Z]|[A-Z]{2}[a-z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9 ]/,tu=["Array","Buffer","DataView","Date","Error","Float32Array","Float64Array","Function","Int8Array","Int16Array","Int32Array","Map","Math","Object","Promise","RegExp","Set","String","Symbol","TypeError","Uint8Array","Uint8ClampedArray","Uint16Array","Uint32Array","WeakMap","_","clearTimeout","isFinite","parseInt","setTimeout"],nu=-1,De={};De[Go]=De[Ko]=De[Yo]=De[Zo]=De[Xo]=De[Qo]=De[Jo]=De[Po]=De[e0]=!0,De[Ne]=De[Ye]=De[Zt]=De[xe]=De[Ge]=De[Se]=De[ge]=De[Ce]=De[Ee]=De[Ae]=De[Ze]=De[ln]=De[ct]=De[kt]=De[$n]=!1;var Ve={};Ve[Ne]=Ve[Ye]=Ve[Zt]=Ve[Ge]=Ve[xe]=Ve[Se]=Ve[Go]=Ve[Ko]=Ve[Yo]=Ve[Zo]=Ve[Xo]=Ve[Ee]=Ve[Ae]=Ve[Ze]=Ve[ln]=Ve[ct]=Ve[kt]=Ve[Hn]=Ve[Qo]=Ve[Jo]=Ve[Po]=Ve[e0]=!0,Ve[ge]=Ve[Ce]=Ve[$n]=!1;var ru={À:"A",Á:"A",Â:"A",Ã:"A",Ä:"A",Å:"A",à:"a",á:"a",â:"a",ã:"a",ä:"a",å:"a",Ç:"C",ç:"c",Ð:"D",ð:"d",È:"E",É:"E",Ê:"E",Ë:"E",è:"e",é:"e",ê:"e",ë:"e",Ì:"I",Í:"I",Î:"I",Ï:"I",ì:"i",í:"i",î:"i",ï:"i",Ñ:"N",ñ:"n",Ò:"O",Ó:"O",Ô:"O",Õ:"O",Ö:"O",Ø:"O",ò:"o",ó:"o",ô:"o",õ:"o",ö:"o",ø:"o",Ù:"U",Ú:"U",Û:"U",Ü:"U",ù:"u",ú:"u",û:"u",ü:"u",Ý:"Y",ý:"y",ÿ:"y",Æ:"Ae",æ:"ae",Þ:"Th",þ:"th",ß:"ss",Ā:"A",Ă:"A",Ą:"A",ā:"a",ă:"a",ą:"a",Ć:"C",Ĉ:"C",Ċ:"C",Č:"C",ć:"c",ĉ:"c",ċ:"c",č:"c",Ď:"D",Đ:"D",ď:"d",đ:"d",Ē:"E",Ĕ:"E",Ė:"E",Ę:"E",Ě:"E",ē:"e",ĕ:"e",ė:"e",ę:"e",ě:"e",Ĝ:"G",Ğ:"G",Ġ:"G",Ģ:"G",ĝ:"g",ğ:"g",ġ:"g",ģ:"g",Ĥ:"H",Ħ:"H",ĥ:"h",ħ:"h",Ĩ:"I",Ī:"I",Ĭ:"I",Į:"I",İ:"I",ĩ:"i",ī:"i",ĭ:"i",į:"i",ı:"i",Ĵ:"J",ĵ:"j",Ķ:"K",ķ:"k",ĸ:"k",Ĺ:"L",Ļ:"L",Ľ:"L",Ŀ:"L",Ł:"L",ĺ:"l",ļ:"l",ľ:"l",ŀ:"l",ł:"l",Ń:"N",Ņ:"N",Ň:"N",Ŋ:"N",ń:"n",ņ:"n",ň:"n",ŋ:"n",Ō:"O",Ŏ:"O",Ő:"O",ō:"o",ŏ:"o",ő:"o",Ŕ:"R",Ŗ:"R",Ř:"R",ŕ:"r",ŗ:"r",ř:"r",Ś:"S",Ŝ:"S",Ş:"S",Š:"S",ś:"s",ŝ:"s",ş:"s",š:"s",Ţ:"T",Ť:"T",Ŧ:"T",ţ:"t",ť:"t",ŧ:"t",Ũ:"U",Ū:"U",Ŭ:"U",Ů:"U",Ű:"U",Ų:"U",ũ:"u",ū:"u",ŭ:"u",ů:"u",ű:"u",ų:"u",Ŵ:"W",ŵ:"w",Ŷ:"Y",ŷ:"y",Ÿ:"Y",Ź:"Z",Ż:"Z",Ž:"Z",ź:"z",ż:"z",ž:"z",Ĳ:"IJ",ĳ:"ij",Œ:"Oe",œ:"oe",ŉ:"'n",ſ:"s"},ou={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"},au={"&amp;":"&","&lt;":"<","&gt;":">","&quot;":'"',"&#39;":"'"},iu={"\\":"\\","'":"'","\n":"n","\r":"r","\u2028":"u2028","\u2029":"u2029"},su=parseFloat,cu=parseInt,Fi=typeof _r=="object"&&_r&&_r.Object===Object&&_r,lu=typeof self=="object"&&self&&self.Object===Object&&self,tt=Fi||lu||Function("return this")(),c0=n&&!n.nodeType&&n,Cn=c0&&!0&&e&&!e.nodeType&&e,zi=Cn&&Cn.exports===c0,l0=zi&&Fi.process,jt=function(){try{var $=Cn&&Cn.require&&Cn.require("util").types;return $||l0&&l0.binding&&l0.binding("util")}catch{}}(),Wi=jt&&jt.isArrayBuffer,ki=jt&&jt.isDate,Ui=jt&&jt.isMap,qi=jt&&jt.isRegExp,Gi=jt&&jt.isSet,Ki=jt&&jt.isTypedArray;function pt($,B,E){switch(E.length){case 0:return $.call(B);case 1:return $.call(B,E[0]);case 2:return $.call(B,E[0],E[1]);case 3:return $.call(B,E[0],E[1],E[2])}return $.apply(B,E)}function uu($,B,E,k){for(var re=-1,Re=$==null?0:$.length;++re<Re;){var Xe=$[re];B(k,Xe,E(Xe),$)}return k}function At($,B){for(var E=-1,k=$==null?0:$.length;++E<k&&B($[E],E,$)!==!1;);return $}function du($,B){for(var E=$==null?0:$.length;E--&&B($[E],E,$)!==!1;);return $}function Yi($,B){for(var E=-1,k=$==null?0:$.length;++E<k;)if(!B($[E],E,$))return!1;return!0}function un($,B){for(var E=-1,k=$==null?0:$.length,re=0,Re=[];++E<k;){var Xe=$[E];B(Xe,E,$)&&(Re[re++]=Xe)}return Re}function kr($,B){var E=$==null?0:$.length;return!!E&&Fn($,B,0)>-1}function u0($,B,E){for(var k=-1,re=$==null?0:$.length;++k<re;)if(E(B,$[k]))return!0;return!1}function He($,B){for(var E=-1,k=$==null?0:$.length,re=Array(k);++E<k;)re[E]=B($[E],E,$);return re}function dn($,B){for(var E=-1,k=B.length,re=$.length;++E<k;)$[re+E]=B[E];return $}function d0($,B,E,k){var re=-1,Re=$==null?0:$.length;for(k&&Re&&(E=$[++re]);++re<Re;)E=B(E,$[re],re,$);return E}function hu($,B,E,k){var re=$==null?0:$.length;for(k&&re&&(E=$[--re]);re--;)E=B(E,$[re],re,$);return E}function h0($,B){for(var E=-1,k=$==null?0:$.length;++E<k;)if(B($[E],E,$))return!0;return!1}var fu=f0("length");function gu($){return $.split("")}function wu($){return $.match(y2)||[]}function Zi($,B,E){var k;return E($,function(re,Re,Xe){if(B(re,Re,Xe))return k=Re,!1}),k}function Ur($,B,E,k){for(var re=$.length,Re=E+(k?1:-1);k?Re--:++Re<re;)if(B($[Re],Re,$))return Re;return-1}function Fn($,B,E){return B===B?ju($,B,E):Ur($,Xi,E)}function mu($,B,E,k){for(var re=E-1,Re=$.length;++re<Re;)if(k($[re],B))return re;return-1}function Xi($){return $!==$}function Qi($,B){var E=$==null?0:$.length;return E?w0($,B)/E:Be}function f0($){return function(B){return B==null?a:B[$]}}function g0($){return function(B){return $==null?a:$[B]}}function Ji($,B,E,k,re){return re($,function(Re,Xe,Le){E=k?(k=!1,Re):B(E,Re,Xe,Le)}),E}function xu($,B){var E=$.length;for($.sort(B);E--;)$[E]=$[E].value;return $}function w0($,B){for(var E,k=-1,re=$.length;++k<re;){var Re=B($[k]);Re!==a&&(E=E===a?Re:E+Re)}return E}function m0($,B){for(var E=-1,k=Array($);++E<$;)k[E]=B(E);return k}function vu($,B){return He(B,function(E){return[E,$[E]]})}function Pi($){return $&&$.slice(0,rs($)+1).replace(n0,"")}function bt($){return function(B){return $(B)}}function x0($,B){return He(B,function(E){return $[E]})}function dr($,B){return $.has(B)}function es($,B){for(var E=-1,k=$.length;++E<k&&Fn(B,$[E],0)>-1;);return E}function ts($,B){for(var E=$.length;E--&&Fn(B,$[E],0)>-1;);return E}function pu($,B){for(var E=$.length,k=0;E--;)$[E]===B&&++k;return k}var bu=g0(ru),$u=g0(ou);function Cu($){return"\\"+iu[$]}function yu($,B){return $==null?a:$[B]}function zn($){return P2.test($)}function Su($){return eu.test($)}function Ru($){for(var B,E=[];!(B=$.next()).done;)E.push(B.value);return E}function v0($){var B=-1,E=Array($.size);return $.forEach(function(k,re){E[++B]=[re,k]}),E}function ns($,B){return function(E){return $(B(E))}}function hn($,B){for(var E=-1,k=$.length,re=0,Re=[];++E<k;){var Xe=$[E];(Xe===B||Xe===C)&&($[E]=C,Re[re++]=E)}return Re}function qr($){var B=-1,E=Array($.size);return $.forEach(function(k){E[++B]=k}),E}function _u($){var B=-1,E=Array($.size);return $.forEach(function(k){E[++B]=[k,k]}),E}function ju($,B,E){for(var k=E-1,re=$.length;++k<re;)if($[k]===B)return k;return-1}function Au($,B,E){for(var k=E+1;k--;)if($[k]===B)return k;return k}function Wn($){return zn($)?Tu($):fu($)}function Bt($){return zn($)?Mu($):gu($)}function rs($){for(var B=$.length;B--&&p2.test($.charAt(B)););return B}var Iu=g0(au);function Tu($){for(var B=s0.lastIndex=0;s0.test($);)++B;return B}function Mu($){return $.match(s0)||[]}function Eu($){return $.match(J2)||[]}var Lu=function $(B){B=B==null?tt:kn.defaults(tt.Object(),B,kn.pick(tt,tu));var E=B.Array,k=B.Date,re=B.Error,Re=B.Function,Xe=B.Math,Le=B.Object,p0=B.RegExp,Vu=B.String,It=B.TypeError,Gr=E.prototype,Bu=Re.prototype,Un=Le.prototype,Kr=B["__core-js_shared__"],Yr=Bu.toString,Te=Un.hasOwnProperty,Du=0,os=function(){var t=/[^.]+$/.exec(Kr&&Kr.keys&&Kr.keys.IE_PROTO||"");return t?"Symbol(src)_1."+t:""}(),Zr=Un.toString,Ou=Yr.call(Le),Hu=tt._,Nu=p0("^"+Yr.call(Te).replace(t0,"\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,"$1.*?")+"$"),Xr=zi?B.Buffer:a,fn=B.Symbol,Qr=B.Uint8Array,as=Xr?Xr.allocUnsafe:a,Jr=ns(Le.getPrototypeOf,Le),is=Le.create,ss=Un.propertyIsEnumerable,Pr=Gr.splice,cs=fn?fn.isConcatSpreadable:a,hr=fn?fn.iterator:a,yn=fn?fn.toStringTag:a,eo=function(){try{var t=An(Le,"defineProperty");return t({},"",{}),t}catch{}}(),Fu=B.clearTimeout!==tt.clearTimeout&&B.clearTimeout,zu=k&&k.now!==tt.Date.now&&k.now,Wu=B.setTimeout!==tt.setTimeout&&B.setTimeout,to=Xe.ceil,no=Xe.floor,b0=Le.getOwnPropertySymbols,ku=Xr?Xr.isBuffer:a,ls=B.isFinite,Uu=Gr.join,qu=ns(Le.keys,Le),Qe=Xe.max,ot=Xe.min,Gu=k.now,Ku=B.parseInt,us=Xe.random,Yu=Gr.reverse,$0=An(B,"DataView"),fr=An(B,"Map"),C0=An(B,"Promise"),qn=An(B,"Set"),gr=An(B,"WeakMap"),wr=An(Le,"create"),ro=gr&&new gr,Gn={},Zu=In($0),Xu=In(fr),Qu=In(C0),Ju=In(qn),Pu=In(gr),oo=fn?fn.prototype:a,mr=oo?oo.valueOf:a,ds=oo?oo.toString:a;function g(t){if(We(t)&&!ae(t)&&!(t instanceof pe)){if(t instanceof Tt)return t;if(Te.call(t,"__wrapped__"))return h1(t)}return new Tt(t)}var Kn=function(){function t(){}return function(r){if(!Fe(r))return{};if(is)return is(r);t.prototype=r;var i=new t;return t.prototype=a,i}}();function ao(){}function Tt(t,r){this.__wrapped__=t,this.__actions__=[],this.__chain__=!!r,this.__index__=0,this.__values__=a}g.templateSettings={escape:f2,evaluate:g2,interpolate:bi,variable:"",imports:{_:g}},g.prototype=ao.prototype,g.prototype.constructor=g,Tt.prototype=Kn(ao.prototype),Tt.prototype.constructor=Tt;function pe(t){this.__wrapped__=t,this.__actions__=[],this.__dir__=1,this.__filtered__=!1,this.__iteratees__=[],this.__takeCount__=he,this.__views__=[]}function ed(){var t=new pe(this.__wrapped__);return t.__actions__=ft(this.__actions__),t.__dir__=this.__dir__,t.__filtered__=this.__filtered__,t.__iteratees__=ft(this.__iteratees__),t.__takeCount__=this.__takeCount__,t.__views__=ft(this.__views__),t}function td(){if(this.__filtered__){var t=new pe(this);t.__dir__=-1,t.__filtered__=!0}else t=this.clone(),t.__dir__*=-1;return t}function nd(){var t=this.__wrapped__.value(),r=this.__dir__,i=ae(t),d=r<0,f=i?t.length:0,w=gh(0,f,this.__views__),x=w.start,p=w.end,S=p-x,O=d?p:x-1,H=this.__iteratees__,F=H.length,W=0,U=ot(S,this.__takeCount__);if(!i||!d&&f==S&&U==S)return Bs(t,this.__actions__);var Q=[];e:for(;S--&&W<U;){O+=r;for(var ue=-1,J=t[O];++ue<F;){var ve=H[ue],be=ve.iteratee,yt=ve.type,dt=be(J);if(yt==_e)J=dt;else if(!dt){if(yt==ee)continue e;break e}}Q[W++]=J}return Q}pe.prototype=Kn(ao.prototype),pe.prototype.constructor=pe;function Sn(t){var r=-1,i=t==null?0:t.length;for(this.clear();++r<i;){var d=t[r];this.set(d[0],d[1])}}function rd(){this.__data__=wr?wr(null):{},this.size=0}function od(t){var r=this.has(t)&&delete this.__data__[t];return this.size-=r?1:0,r}function ad(t){var r=this.__data__;if(wr){var i=r[t];return i===v?a:i}return Te.call(r,t)?r[t]:a}function id(t){var r=this.__data__;return wr?r[t]!==a:Te.call(r,t)}function sd(t,r){var i=this.__data__;return this.size+=this.has(t)?0:1,i[t]=wr&&r===a?v:r,this}Sn.prototype.clear=rd,Sn.prototype.delete=od,Sn.prototype.get=ad,Sn.prototype.has=id,Sn.prototype.set=sd;function Xt(t){var r=-1,i=t==null?0:t.length;for(this.clear();++r<i;){var d=t[r];this.set(d[0],d[1])}}function cd(){this.__data__=[],this.size=0}function ld(t){var r=this.__data__,i=io(r,t);if(i<0)return!1;var d=r.length-1;return i==d?r.pop():Pr.call(r,i,1),--this.size,!0}function ud(t){var r=this.__data__,i=io(r,t);return i<0?a:r[i][1]}function dd(t){return io(this.__data__,t)>-1}function hd(t,r){var i=this.__data__,d=io(i,t);return d<0?(++this.size,i.push([t,r])):i[d][1]=r,this}Xt.prototype.clear=cd,Xt.prototype.delete=ld,Xt.prototype.get=ud,Xt.prototype.has=dd,Xt.prototype.set=hd;function Qt(t){var r=-1,i=t==null?0:t.length;for(this.clear();++r<i;){var d=t[r];this.set(d[0],d[1])}}function fd(){this.size=0,this.__data__={hash:new Sn,map:new(fr||Xt),string:new Sn}}function gd(t){var r=po(this,t).delete(t);return this.size-=r?1:0,r}function wd(t){return po(this,t).get(t)}function md(t){return po(this,t).has(t)}function xd(t,r){var i=po(this,t),d=i.size;return i.set(t,r),this.size+=i.size==d?0:1,this}Qt.prototype.clear=fd,Qt.prototype.delete=gd,Qt.prototype.get=wd,Qt.prototype.has=md,Qt.prototype.set=xd;function Rn(t){var r=-1,i=t==null?0:t.length;for(this.__data__=new Qt;++r<i;)this.add(t[r])}function vd(t){return this.__data__.set(t,v),this}function pd(t){return this.__data__.has(t)}Rn.prototype.add=Rn.prototype.push=vd,Rn.prototype.has=pd;function Dt(t){var r=this.__data__=new Xt(t);this.size=r.size}function bd(){this.__data__=new Xt,this.size=0}function $d(t){var r=this.__data__,i=r.delete(t);return this.size=r.size,i}function Cd(t){return this.__data__.get(t)}function yd(t){return this.__data__.has(t)}function Sd(t,r){var i=this.__data__;if(i instanceof Xt){var d=i.__data__;if(!fr||d.length<o-1)return d.push([t,r]),this.size=++i.size,this;i=this.__data__=new Qt(d)}return i.set(t,r),this.size=i.size,this}Dt.prototype.clear=bd,Dt.prototype.delete=$d,Dt.prototype.get=Cd,Dt.prototype.has=yd,Dt.prototype.set=Sd;function hs(t,r){var i=ae(t),d=!i&&Tn(t),f=!i&&!d&&vn(t),w=!i&&!d&&!f&&Qn(t),x=i||d||f||w,p=x?m0(t.length,Vu):[],S=p.length;for(var O in t)(r||Te.call(t,O))&&!(x&&(O=="length"||f&&(O=="offset"||O=="parent")||w&&(O=="buffer"||O=="byteLength"||O=="byteOffset")||tn(O,S)))&&p.push(O);return p}function fs(t){var r=t.length;return r?t[L0(0,r-1)]:a}function Rd(t,r){return bo(ft(t),_n(r,0,t.length))}function _d(t){return bo(ft(t))}function y0(t,r,i){(i!==a&&!Ot(t[r],i)||i===a&&!(r in t))&&Jt(t,r,i)}function xr(t,r,i){var d=t[r];(!(Te.call(t,r)&&Ot(d,i))||i===a&&!(r in t))&&Jt(t,r,i)}function io(t,r){for(var i=t.length;i--;)if(Ot(t[i][0],r))return i;return-1}function jd(t,r,i,d){return gn(t,function(f,w,x){r(d,f,i(f),x)}),d}function gs(t,r){return t&&qt(r,Pe(r),t)}function Ad(t,r){return t&&qt(r,wt(r),t)}function Jt(t,r,i){r=="__proto__"&&eo?eo(t,r,{configurable:!0,enumerable:!0,value:i,writable:!0}):t[r]=i}function S0(t,r){for(var i=-1,d=r.length,f=E(d),w=t==null;++i<d;)f[i]=w?a:oa(t,r[i]);return f}function _n(t,r,i){return t===t&&(i!==a&&(t=t<=i?t:i),r!==a&&(t=t>=r?t:r)),t}function Mt(t,r,i,d,f,w){var x,p=r&y,S=r&b,O=r&A;if(i&&(x=f?i(t,d,f,w):i(t)),x!==a)return x;if(!Fe(t))return t;var H=ae(t);if(H){if(x=mh(t),!p)return ft(t,x)}else{var F=at(t),W=F==Ce||F==rt;if(vn(t))return Hs(t,p);if(F==Ze||F==Ne||W&&!f){if(x=S||W?{}:r1(t),!p)return S?ah(t,Ad(x,t)):oh(t,gs(x,t))}else{if(!Ve[F])return f?t:{};x=xh(t,F,p)}}w||(w=new Dt);var U=w.get(t);if(U)return U;w.set(t,x),E1(t)?t.forEach(function(J){x.add(Mt(J,r,i,J,t,w))}):T1(t)&&t.forEach(function(J,ve){x.set(ve,Mt(J,r,i,ve,t,w))});var Q=O?S?U0:k0:S?wt:Pe,ue=H?a:Q(t);return At(ue||t,function(J,ve){ue&&(ve=J,J=t[ve]),xr(x,ve,Mt(J,r,i,ve,t,w))}),x}function Id(t){var r=Pe(t);return function(i){return ws(i,t,r)}}function ws(t,r,i){var d=i.length;if(t==null)return!d;for(t=Le(t);d--;){var f=i[d],w=r[f],x=t[f];if(x===a&&!(f in t)||!w(x))return!1}return!0}function ms(t,r,i){if(typeof t!="function")throw new It(u);return Sr(function(){t.apply(a,i)},r)}function vr(t,r,i,d){var f=-1,w=kr,x=!0,p=t.length,S=[],O=r.length;if(!p)return S;i&&(r=He(r,bt(i))),d?(w=u0,x=!1):r.length>=o&&(w=dr,x=!1,r=new Rn(r));e:for(;++f<p;){var H=t[f],F=i==null?H:i(H);if(H=d||H!==0?H:0,x&&F===F){for(var W=O;W--;)if(r[W]===F)continue e;S.push(H)}else w(r,F,d)||S.push(H)}return S}var gn=ks(Ut),xs=ks(_0,!0);function Td(t,r){var i=!0;return gn(t,function(d,f,w){return i=!!r(d,f,w),i}),i}function so(t,r,i){for(var d=-1,f=t.length;++d<f;){var w=t[d],x=r(w);if(x!=null&&(p===a?x===x&&!Ct(x):i(x,p)))var p=x,S=w}return S}function Md(t,r,i,d){var f=t.length;for(i=ce(i),i<0&&(i=-i>f?0:f+i),d=d===a||d>f?f:ce(d),d<0&&(d+=f),d=i>d?0:V1(d);i<d;)t[i++]=r;return t}function vs(t,r){var i=[];return gn(t,function(d,f,w){r(d,f,w)&&i.push(d)}),i}function nt(t,r,i,d,f){var w=-1,x=t.length;for(i||(i=ph),f||(f=[]);++w<x;){var p=t[w];r>0&&i(p)?r>1?nt(p,r-1,i,d,f):dn(f,p):d||(f[f.length]=p)}return f}var R0=Us(),ps=Us(!0);function Ut(t,r){return t&&R0(t,r,Pe)}function _0(t,r){return t&&ps(t,r,Pe)}function co(t,r){return un(r,function(i){return nn(t[i])})}function jn(t,r){r=mn(r,t);for(var i=0,d=r.length;t!=null&&i<d;)t=t[Gt(r[i++])];return i&&i==d?t:a}function bs(t,r,i){var d=r(t);return ae(t)?d:dn(d,i(t))}function lt(t){return t==null?t===a?ur:_t:yn&&yn in Le(t)?fh(t):_h(t)}function j0(t,r){return t>r}function Ed(t,r){return t!=null&&Te.call(t,r)}function Ld(t,r){return t!=null&&r in Le(t)}function Vd(t,r,i){return t>=ot(r,i)&&t<Qe(r,i)}function A0(t,r,i){for(var d=i?u0:kr,f=t[0].length,w=t.length,x=w,p=E(w),S=1/0,O=[];x--;){var H=t[x];x&&r&&(H=He(H,bt(r))),S=ot(H.length,S),p[x]=!i&&(r||f>=120&&H.length>=120)?new Rn(x&&H):a}H=t[0];var F=-1,W=p[0];e:for(;++F<f&&O.length<S;){var U=H[F],Q=r?r(U):U;if(U=i||U!==0?U:0,!(W?dr(W,Q):d(O,Q,i))){for(x=w;--x;){var ue=p[x];if(!(ue?dr(ue,Q):d(t[x],Q,i)))continue e}W&&W.push(Q),O.push(U)}}return O}function Bd(t,r,i,d){return Ut(t,function(f,w,x){r(d,i(f),w,x)}),d}function pr(t,r,i){r=mn(r,t),t=s1(t,r);var d=t==null?t:t[Gt(Lt(r))];return d==null?a:pt(d,t,i)}function $s(t){return We(t)&&lt(t)==Ne}function Dd(t){return We(t)&&lt(t)==Zt}function Od(t){return We(t)&&lt(t)==Se}function br(t,r,i,d,f){return t===r?!0:t==null||r==null||!We(t)&&!We(r)?t!==t&&r!==r:Hd(t,r,i,d,br,f)}function Hd(t,r,i,d,f,w){var x=ae(t),p=ae(r),S=x?Ye:at(t),O=p?Ye:at(r);S=S==Ne?Ze:S,O=O==Ne?Ze:O;var H=S==Ze,F=O==Ze,W=S==O;if(W&&vn(t)){if(!vn(r))return!1;x=!0,H=!1}if(W&&!H)return w||(w=new Dt),x||Qn(t)?e1(t,r,i,d,f,w):dh(t,r,S,i,d,f,w);if(!(i&T)){var U=H&&Te.call(t,"__wrapped__"),Q=F&&Te.call(r,"__wrapped__");if(U||Q){var ue=U?t.value():t,J=Q?r.value():r;return w||(w=new Dt),f(ue,J,i,d,w)}}return W?(w||(w=new Dt),hh(t,r,i,d,f,w)):!1}function Nd(t){return We(t)&&at(t)==Ee}function I0(t,r,i,d){var f=i.length,w=f,x=!d;if(t==null)return!w;for(t=Le(t);f--;){var p=i[f];if(x&&p[2]?p[1]!==t[p[0]]:!(p[0]in t))return!1}for(;++f<w;){p=i[f];var S=p[0],O=t[S],H=p[1];if(x&&p[2]){if(O===a&&!(S in t))return!1}else{var F=new Dt;if(d)var W=d(O,H,S,t,r,F);if(!(W===a?br(H,O,T|M,d,F):W))return!1}}return!0}function Cs(t){if(!Fe(t)||$h(t))return!1;var r=nn(t)?Nu:I2;return r.test(In(t))}function Fd(t){return We(t)&&lt(t)==ln}function zd(t){return We(t)&&at(t)==ct}function Wd(t){return We(t)&&_o(t.length)&&!!De[lt(t)]}function ys(t){return typeof t=="function"?t:t==null?mt:typeof t=="object"?ae(t)?_s(t[0],t[1]):Rs(t):q1(t)}function T0(t){if(!yr(t))return qu(t);var r=[];for(var i in Le(t))Te.call(t,i)&&i!="constructor"&&r.push(i);return r}function kd(t){if(!Fe(t))return Rh(t);var r=yr(t),i=[];for(var d in t)d=="constructor"&&(r||!Te.call(t,d))||i.push(d);return i}function M0(t,r){return t<r}function Ss(t,r){var i=-1,d=gt(t)?E(t.length):[];return gn(t,function(f,w,x){d[++i]=r(f,w,x)}),d}function Rs(t){var r=G0(t);return r.length==1&&r[0][2]?a1(r[0][0],r[0][1]):function(i){return i===t||I0(i,t,r)}}function _s(t,r){return Y0(t)&&o1(r)?a1(Gt(t),r):function(i){var d=oa(i,t);return d===a&&d===r?aa(i,t):br(r,d,T|M)}}function lo(t,r,i,d,f){t!==r&&R0(r,function(w,x){if(f||(f=new Dt),Fe(w))Ud(t,r,x,i,lo,d,f);else{var p=d?d(X0(t,x),w,x+"",t,r,f):a;p===a&&(p=w),y0(t,x,p)}},wt)}function Ud(t,r,i,d,f,w,x){var p=X0(t,i),S=X0(r,i),O=x.get(S);if(O){y0(t,i,O);return}var H=w?w(p,S,i+"",t,r,x):a,F=H===a;if(F){var W=ae(S),U=!W&&vn(S),Q=!W&&!U&&Qn(S);H=S,W||U||Q?ae(p)?H=p:ke(p)?H=ft(p):U?(F=!1,H=Hs(S,!0)):Q?(F=!1,H=Ns(S,!0)):H=[]:Rr(S)||Tn(S)?(H=p,Tn(p)?H=B1(p):(!Fe(p)||nn(p))&&(H=r1(S))):F=!1}F&&(x.set(S,H),f(H,S,d,w,x),x.delete(S)),y0(t,i,H)}function js(t,r){var i=t.length;if(i)return r+=r<0?i:0,tn(r,i)?t[r]:a}function As(t,r,i){r.length?r=He(r,function(w){return ae(w)?function(x){return jn(x,w.length===1?w[0]:w)}:w}):r=[mt];var d=-1;r=He(r,bt(Y()));var f=Ss(t,function(w,x,p){var S=He(r,function(O){return O(w)});return{criteria:S,index:++d,value:w}});return xu(f,function(w,x){return rh(w,x,i)})}function qd(t,r){return Is(t,r,function(i,d){return aa(t,d)})}function Is(t,r,i){for(var d=-1,f=r.length,w={};++d<f;){var x=r[d],p=jn(t,x);i(p,x)&&$r(w,mn(x,t),p)}return w}function Gd(t){return function(r){return jn(r,t)}}function E0(t,r,i,d){var f=d?mu:Fn,w=-1,x=r.length,p=t;for(t===r&&(r=ft(r)),i&&(p=He(t,bt(i)));++w<x;)for(var S=0,O=r[w],H=i?i(O):O;(S=f(p,H,S,d))>-1;)p!==t&&Pr.call(p,S,1),Pr.call(t,S,1);return t}function Ts(t,r){for(var i=t?r.length:0,d=i-1;i--;){var f=r[i];if(i==d||f!==w){var w=f;tn(f)?Pr.call(t,f,1):D0(t,f)}}return t}function L0(t,r){return t+no(us()*(r-t+1))}function Kd(t,r,i,d){for(var f=-1,w=Qe(to((r-t)/(i||1)),0),x=E(w);w--;)x[d?w:++f]=t,t+=i;return x}function V0(t,r){var i="";if(!t||r<1||r>ye)return i;do r%2&&(i+=t),r=no(r/2),r&&(t+=t);while(r);return i}function fe(t,r){return Q0(i1(t,r,mt),t+"")}function Yd(t){return fs(Jn(t))}function Zd(t,r){var i=Jn(t);return bo(i,_n(r,0,i.length))}function $r(t,r,i,d){if(!Fe(t))return t;r=mn(r,t);for(var f=-1,w=r.length,x=w-1,p=t;p!=null&&++f<w;){var S=Gt(r[f]),O=i;if(S==="__proto__"||S==="constructor"||S==="prototype")return t;if(f!=x){var H=p[S];O=d?d(H,S,p):a,O===a&&(O=Fe(H)?H:tn(r[f+1])?[]:{})}xr(p,S,O),p=p[S]}return t}var Ms=ro?function(t,r){return ro.set(t,r),t}:mt,Xd=eo?function(t,r){return eo(t,"toString",{configurable:!0,enumerable:!1,value:sa(r),writable:!0})}:mt;function Qd(t){return bo(Jn(t))}function Et(t,r,i){var d=-1,f=t.length;r<0&&(r=-r>f?0:f+r),i=i>f?f:i,i<0&&(i+=f),f=r>i?0:i-r>>>0,r>>>=0;for(var w=E(f);++d<f;)w[d]=t[d+r];return w}function Jd(t,r){var i;return gn(t,function(d,f,w){return i=r(d,f,w),!i}),!!i}function uo(t,r,i){var d=0,f=t==null?d:t.length;if(typeof r=="number"&&r===r&&f<=me){for(;d<f;){var w=d+f>>>1,x=t[w];x!==null&&!Ct(x)&&(i?x<=r:x<r)?d=w+1:f=w}return f}return B0(t,r,mt,i)}function B0(t,r,i,d){var f=0,w=t==null?0:t.length;if(w===0)return 0;r=i(r);for(var x=r!==r,p=r===null,S=Ct(r),O=r===a;f<w;){var H=no((f+w)/2),F=i(t[H]),W=F!==a,U=F===null,Q=F===F,ue=Ct(F);if(x)var J=d||Q;else O?J=Q&&(d||W):p?J=Q&&W&&(d||!U):S?J=Q&&W&&!U&&(d||!ue):U||ue?J=!1:J=d?F<=r:F<r;J?f=H+1:w=H}return ot(w,Je)}function Es(t,r){for(var i=-1,d=t.length,f=0,w=[];++i<d;){var x=t[i],p=r?r(x):x;if(!i||!Ot(p,S)){var S=p;w[f++]=x===0?0:x}}return w}function Ls(t){return typeof t=="number"?t:Ct(t)?Be:+t}function $t(t){if(typeof t=="string")return t;if(ae(t))return He(t,$t)+"";if(Ct(t))return ds?ds.call(t):"";var r=t+"";return r=="0"&&1/t==-we?"-0":r}function wn(t,r,i){var d=-1,f=kr,w=t.length,x=!0,p=[],S=p;if(i)x=!1,f=u0;else if(w>=o){var O=r?null:lh(t);if(O)return qr(O);x=!1,f=dr,S=new Rn}else S=r?[]:p;e:for(;++d<w;){var H=t[d],F=r?r(H):H;if(H=i||H!==0?H:0,x&&F===F){for(var W=S.length;W--;)if(S[W]===F)continue e;r&&S.push(F),p.push(H)}else f(S,F,i)||(S!==p&&S.push(F),p.push(H))}return p}function D0(t,r){return r=mn(r,t),t=s1(t,r),t==null||delete t[Gt(Lt(r))]}function Vs(t,r,i,d){return $r(t,r,i(jn(t,r)),d)}function ho(t,r,i,d){for(var f=t.length,w=d?f:-1;(d?w--:++w<f)&&r(t[w],w,t););return i?Et(t,d?0:w,d?w+1:f):Et(t,d?w+1:0,d?f:w)}function Bs(t,r){var i=t;return i instanceof pe&&(i=i.value()),d0(r,function(d,f){return f.func.apply(f.thisArg,dn([d],f.args))},i)}function O0(t,r,i){var d=t.length;if(d<2)return d?wn(t[0]):[];for(var f=-1,w=E(d);++f<d;)for(var x=t[f],p=-1;++p<d;)p!=f&&(w[f]=vr(w[f]||x,t[p],r,i));return wn(nt(w,1),r,i)}function Ds(t,r,i){for(var d=-1,f=t.length,w=r.length,x={};++d<f;){var p=d<w?r[d]:a;i(x,t[d],p)}return x}function H0(t){return ke(t)?t:[]}function N0(t){return typeof t=="function"?t:mt}function mn(t,r){return ae(t)?t:Y0(t,r)?[t]:d1(Ie(t))}var Pd=fe;function xn(t,r,i){var d=t.length;return i=i===a?d:i,!r&&i>=d?t:Et(t,r,i)}var Os=Fu||function(t){return tt.clearTimeout(t)};function Hs(t,r){if(r)return t.slice();var i=t.length,d=as?as(i):new t.constructor(i);return t.copy(d),d}function F0(t){var r=new t.constructor(t.byteLength);return new Qr(r).set(new Qr(t)),r}function eh(t,r){var i=r?F0(t.buffer):t.buffer;return new t.constructor(i,t.byteOffset,t.byteLength)}function th(t){var r=new t.constructor(t.source,$i.exec(t));return r.lastIndex=t.lastIndex,r}function nh(t){return mr?Le(mr.call(t)):{}}function Ns(t,r){var i=r?F0(t.buffer):t.buffer;return new t.constructor(i,t.byteOffset,t.length)}function Fs(t,r){if(t!==r){var i=t!==a,d=t===null,f=t===t,w=Ct(t),x=r!==a,p=r===null,S=r===r,O=Ct(r);if(!p&&!O&&!w&&t>r||w&&x&&S&&!p&&!O||d&&x&&S||!i&&S||!f)return 1;if(!d&&!w&&!O&&t<r||O&&i&&f&&!d&&!w||p&&i&&f||!x&&f||!S)return-1}return 0}function rh(t,r,i){for(var d=-1,f=t.criteria,w=r.criteria,x=f.length,p=i.length;++d<x;){var S=Fs(f[d],w[d]);if(S){if(d>=p)return S;var O=i[d];return S*(O=="desc"?-1:1)}}return t.index-r.index}function zs(t,r,i,d){for(var f=-1,w=t.length,x=i.length,p=-1,S=r.length,O=Qe(w-x,0),H=E(S+O),F=!d;++p<S;)H[p]=r[p];for(;++f<x;)(F||f<w)&&(H[i[f]]=t[f]);for(;O--;)H[p++]=t[f++];return H}function Ws(t,r,i,d){for(var f=-1,w=t.length,x=-1,p=i.length,S=-1,O=r.length,H=Qe(w-p,0),F=E(H+O),W=!d;++f<H;)F[f]=t[f];for(var U=f;++S<O;)F[U+S]=r[S];for(;++x<p;)(W||f<w)&&(F[U+i[x]]=t[f++]);return F}function ft(t,r){var i=-1,d=t.length;for(r||(r=E(d));++i<d;)r[i]=t[i];return r}function qt(t,r,i,d){var f=!i;i||(i={});for(var w=-1,x=r.length;++w<x;){var p=r[w],S=d?d(i[p],t[p],p,i,t):a;S===a&&(S=t[p]),f?Jt(i,p,S):xr(i,p,S)}return i}function oh(t,r){return qt(t,K0(t),r)}function ah(t,r){return qt(t,t1(t),r)}function fo(t,r){return function(i,d){var f=ae(i)?uu:jd,w=r?r():{};return f(i,t,Y(d,2),w)}}function Yn(t){return fe(function(r,i){var d=-1,f=i.length,w=f>1?i[f-1]:a,x=f>2?i[2]:a;for(w=t.length>3&&typeof w=="function"?(f--,w):a,x&&ut(i[0],i[1],x)&&(w=f<3?a:w,f=1),r=Le(r);++d<f;){var p=i[d];p&&t(r,p,d,w)}return r})}function ks(t,r){return function(i,d){if(i==null)return i;if(!gt(i))return t(i,d);for(var f=i.length,w=r?f:-1,x=Le(i);(r?w--:++w<f)&&d(x[w],w,x)!==!1;);return i}}function Us(t){return function(r,i,d){for(var f=-1,w=Le(r),x=d(r),p=x.length;p--;){var S=x[t?p:++f];if(i(w[S],S,w)===!1)break}return r}}function ih(t,r,i){var d=r&V,f=Cr(t);function w(){var x=this&&this!==tt&&this instanceof w?f:t;return x.apply(d?i:this,arguments)}return w}function qs(t){return function(r){r=Ie(r);var i=zn(r)?Bt(r):a,d=i?i[0]:r.charAt(0),f=i?xn(i,1).join(""):r.slice(1);return d[t]()+f}}function Zn(t){return function(r){return d0(k1(W1(r).replace(X2,"")),t,"")}}function Cr(t){return function(){var r=arguments;switch(r.length){case 0:return new t;case 1:return new t(r[0]);case 2:return new t(r[0],r[1]);case 3:return new t(r[0],r[1],r[2]);case 4:return new t(r[0],r[1],r[2],r[3]);case 5:return new t(r[0],r[1],r[2],r[3],r[4]);case 6:return new t(r[0],r[1],r[2],r[3],r[4],r[5]);case 7:return new t(r[0],r[1],r[2],r[3],r[4],r[5],r[6])}var i=Kn(t.prototype),d=t.apply(i,r);return Fe(d)?d:i}}function sh(t,r,i){var d=Cr(t);function f(){for(var w=arguments.length,x=E(w),p=w,S=Xn(f);p--;)x[p]=arguments[p];var O=w<3&&x[0]!==S&&x[w-1]!==S?[]:hn(x,S);if(w-=O.length,w<i)return Xs(t,r,go,f.placeholder,a,x,O,a,a,i-w);var H=this&&this!==tt&&this instanceof f?d:t;return pt(H,this,x)}return f}function Gs(t){return function(r,i,d){var f=Le(r);if(!gt(r)){var w=Y(i,3);r=Pe(r),i=function(p){return w(f[p],p,f)}}var x=t(r,i,d);return x>-1?f[w?r[x]:x]:a}}function Ks(t){return en(function(r){var i=r.length,d=i,f=Tt.prototype.thru;for(t&&r.reverse();d--;){var w=r[d];if(typeof w!="function")throw new It(u);if(f&&!x&&vo(w)=="wrapper")var x=new Tt([],!0)}for(d=x?d:i;++d<i;){w=r[d];var p=vo(w),S=p=="wrapper"?q0(w):a;S&&Z0(S[0])&&S[1]==(q|D|z|de)&&!S[4].length&&S[9]==1?x=x[vo(S[0])].apply(x,S[3]):x=w.length==1&&Z0(w)?x[p]():x.thru(w)}return function(){var O=arguments,H=O[0];if(x&&O.length==1&&ae(H))return x.plant(H).value();for(var F=0,W=i?r[F].apply(this,O):H;++F<i;)W=r[F].call(this,W);return W}})}function go(t,r,i,d,f,w,x,p,S,O){var H=r&q,F=r&V,W=r&L,U=r&(D|N),Q=r&ie,ue=W?a:Cr(t);function J(){for(var ve=arguments.length,be=E(ve),yt=ve;yt--;)be[yt]=arguments[yt];if(U)var dt=Xn(J),St=pu(be,dt);if(d&&(be=zs(be,d,f,U)),w&&(be=Ws(be,w,x,U)),ve-=St,U&&ve<O){var Ue=hn(be,dt);return Xs(t,r,go,J.placeholder,i,be,Ue,p,S,O-ve)}var Ht=F?i:this,on=W?Ht[t]:t;return ve=be.length,p?be=jh(be,p):Q&&ve>1&&be.reverse(),H&&S<ve&&(be.length=S),this&&this!==tt&&this instanceof J&&(on=ue||Cr(on)),on.apply(Ht,be)}return J}function Ys(t,r){return function(i,d){return Bd(i,t,r(d),{})}}function wo(t,r){return function(i,d){var f;if(i===a&&d===a)return r;if(i!==a&&(f=i),d!==a){if(f===a)return d;typeof i=="string"||typeof d=="string"?(i=$t(i),d=$t(d)):(i=Ls(i),d=Ls(d)),f=t(i,d)}return f}}function z0(t){return en(function(r){return r=He(r,bt(Y())),fe(function(i){var d=this;return t(r,function(f){return pt(f,d,i)})})})}function mo(t,r){r=r===a?" ":$t(r);var i=r.length;if(i<2)return i?V0(r,t):r;var d=V0(r,to(t/Wn(r)));return zn(r)?xn(Bt(d),0,t).join(""):d.slice(0,t)}function ch(t,r,i,d){var f=r&V,w=Cr(t);function x(){for(var p=-1,S=arguments.length,O=-1,H=d.length,F=E(H+S),W=this&&this!==tt&&this instanceof x?w:t;++O<H;)F[O]=d[O];for(;S--;)F[O++]=arguments[++p];return pt(W,f?i:this,F)}return x}function Zs(t){return function(r,i,d){return d&&typeof d!="number"&&ut(r,i,d)&&(i=d=a),r=rn(r),i===a?(i=r,r=0):i=rn(i),d=d===a?r<i?1:-1:rn(d),Kd(r,i,d,t)}}function xo(t){return function(r,i){return typeof r=="string"&&typeof i=="string"||(r=Vt(r),i=Vt(i)),t(r,i)}}function Xs(t,r,i,d,f,w,x,p,S,O){var H=r&D,F=H?x:a,W=H?a:x,U=H?w:a,Q=H?a:w;r|=H?z:X,r&=~(H?X:z),r&_||(r&=-4);var ue=[t,r,f,U,F,Q,W,p,S,O],J=i.apply(a,ue);return Z0(t)&&c1(J,ue),J.placeholder=d,l1(J,t,r)}function W0(t){var r=Xe[t];return function(i,d){if(i=Vt(i),d=d==null?0:ot(ce(d),292),d&&ls(i)){var f=(Ie(i)+"e").split("e"),w=r(f[0]+"e"+(+f[1]+d));return f=(Ie(w)+"e").split("e"),+(f[0]+"e"+(+f[1]-d))}return r(i)}}var lh=qn&&1/qr(new qn([,-0]))[1]==we?function(t){return new qn(t)}:ua;function Qs(t){return function(r){var i=at(r);return i==Ee?v0(r):i==ct?_u(r):vu(r,t(r))}}function Pt(t,r,i,d,f,w,x,p){var S=r&L;if(!S&&typeof t!="function")throw new It(u);var O=d?d.length:0;if(O||(r&=-97,d=f=a),x=x===a?x:Qe(ce(x),0),p=p===a?p:ce(p),O-=f?f.length:0,r&X){var H=d,F=f;d=f=a}var W=S?a:q0(t),U=[t,r,i,d,f,H,F,w,x,p];if(W&&Sh(U,W),t=U[0],r=U[1],i=U[2],d=U[3],f=U[4],p=U[9]=U[9]===a?S?0:t.length:Qe(U[9]-O,0),!p&&r&(D|N)&&(r&=-25),!r||r==V)var Q=ih(t,r,i);else r==D||r==N?Q=sh(t,r,p):(r==z||r==(V|z))&&!f.length?Q=ch(t,r,i,d):Q=go.apply(a,U);var ue=W?Ms:c1;return l1(ue(Q,U),t,r)}function Js(t,r,i,d){return t===a||Ot(t,Un[i])&&!Te.call(d,i)?r:t}function Ps(t,r,i,d,f,w){return Fe(t)&&Fe(r)&&(w.set(r,t),lo(t,r,a,Ps,w),w.delete(r)),t}function uh(t){return Rr(t)?a:t}function e1(t,r,i,d,f,w){var x=i&T,p=t.length,S=r.length;if(p!=S&&!(x&&S>p))return!1;var O=w.get(t),H=w.get(r);if(O&&H)return O==r&&H==t;var F=-1,W=!0,U=i&M?new Rn:a;for(w.set(t,r),w.set(r,t);++F<p;){var Q=t[F],ue=r[F];if(d)var J=x?d(ue,Q,F,r,t,w):d(Q,ue,F,t,r,w);if(J!==a){if(J)continue;W=!1;break}if(U){if(!h0(r,function(ve,be){if(!dr(U,be)&&(Q===ve||f(Q,ve,i,d,w)))return U.push(be)})){W=!1;break}}else if(!(Q===ue||f(Q,ue,i,d,w))){W=!1;break}}return w.delete(t),w.delete(r),W}function dh(t,r,i,d,f,w,x){switch(i){case Ge:if(t.byteLength!=r.byteLength||t.byteOffset!=r.byteOffset)return!1;t=t.buffer,r=r.buffer;case Zt:return!(t.byteLength!=r.byteLength||!w(new Qr(t),new Qr(r)));case xe:case Se:case Ae:return Ot(+t,+r);case ge:return t.name==r.name&&t.message==r.message;case ln:case kt:return t==r+"";case Ee:var p=v0;case ct:var S=d&T;if(p||(p=qr),t.size!=r.size&&!S)return!1;var O=x.get(t);if(O)return O==r;d|=M,x.set(t,r);var H=e1(p(t),p(r),d,f,w,x);return x.delete(t),H;case Hn:if(mr)return mr.call(t)==mr.call(r)}return!1}function hh(t,r,i,d,f,w){var x=i&T,p=k0(t),S=p.length,O=k0(r),H=O.length;if(S!=H&&!x)return!1;for(var F=S;F--;){var W=p[F];if(!(x?W in r:Te.call(r,W)))return!1}var U=w.get(t),Q=w.get(r);if(U&&Q)return U==r&&Q==t;var ue=!0;w.set(t,r),w.set(r,t);for(var J=x;++F<S;){W=p[F];var ve=t[W],be=r[W];if(d)var yt=x?d(be,ve,W,r,t,w):d(ve,be,W,t,r,w);if(!(yt===a?ve===be||f(ve,be,i,d,w):yt)){ue=!1;break}J||(J=W=="constructor")}if(ue&&!J){var dt=t.constructor,St=r.constructor;dt!=St&&"constructor"in t&&"constructor"in r&&!(typeof dt=="function"&&dt instanceof dt&&typeof St=="function"&&St instanceof St)&&(ue=!1)}return w.delete(t),w.delete(r),ue}function en(t){return Q0(i1(t,a,w1),t+"")}function k0(t){return bs(t,Pe,K0)}function U0(t){return bs(t,wt,t1)}var q0=ro?function(t){return ro.get(t)}:ua;function vo(t){for(var r=t.name+"",i=Gn[r],d=Te.call(Gn,r)?i.length:0;d--;){var f=i[d],w=f.func;if(w==null||w==t)return f.name}return r}function Xn(t){var r=Te.call(g,"placeholder")?g:t;return r.placeholder}function Y(){var t=g.iteratee||ca;return t=t===ca?ys:t,arguments.length?t(arguments[0],arguments[1]):t}function po(t,r){var i=t.__data__;return bh(r)?i[typeof r=="string"?"string":"hash"]:i.map}function G0(t){for(var r=Pe(t),i=r.length;i--;){var d=r[i],f=t[d];r[i]=[d,f,o1(f)]}return r}function An(t,r){var i=yu(t,r);return Cs(i)?i:a}function fh(t){var r=Te.call(t,yn),i=t[yn];try{t[yn]=a;var d=!0}catch{}var f=Zr.call(t);return d&&(r?t[yn]=i:delete t[yn]),f}var K0=b0?function(t){return t==null?[]:(t=Le(t),un(b0(t),function(r){return ss.call(t,r)}))}:da,t1=b0?function(t){for(var r=[];t;)dn(r,K0(t)),t=Jr(t);return r}:da,at=lt;($0&&at(new $0(new ArrayBuffer(1)))!=Ge||fr&&at(new fr)!=Ee||C0&&at(C0.resolve())!=lr||qn&&at(new qn)!=ct||gr&&at(new gr)!=$n)&&(at=function(t){var r=lt(t),i=r==Ze?t.constructor:a,d=i?In(i):"";if(d)switch(d){case Zu:return Ge;case Xu:return Ee;case Qu:return lr;case Ju:return ct;case Pu:return $n}return r});function gh(t,r,i){for(var d=-1,f=i.length;++d<f;){var w=i[d],x=w.size;switch(w.type){case"drop":t+=x;break;case"dropRight":r-=x;break;case"take":r=ot(r,t+x);break;case"takeRight":t=Qe(t,r-x);break}}return{start:t,end:r}}function wh(t){var r=t.match($2);return r?r[1].split(C2):[]}function n1(t,r,i){r=mn(r,t);for(var d=-1,f=r.length,w=!1;++d<f;){var x=Gt(r[d]);if(!(w=t!=null&&i(t,x)))break;t=t[x]}return w||++d!=f?w:(f=t==null?0:t.length,!!f&&_o(f)&&tn(x,f)&&(ae(t)||Tn(t)))}function mh(t){var r=t.length,i=new t.constructor(r);return r&&typeof t[0]=="string"&&Te.call(t,"index")&&(i.index=t.index,i.input=t.input),i}function r1(t){return typeof t.constructor=="function"&&!yr(t)?Kn(Jr(t)):{}}function xh(t,r,i){var d=t.constructor;switch(r){case Zt:return F0(t);case xe:case Se:return new d(+t);case Ge:return eh(t,i);case Go:case Ko:case Yo:case Zo:case Xo:case Qo:case Jo:case Po:case e0:return Ns(t,i);case Ee:return new d;case Ae:case kt:return new d(t);case ln:return th(t);case ct:return new d;case Hn:return nh(t)}}function vh(t,r){var i=r.length;if(!i)return t;var d=i-1;return r[d]=(i>1?"& ":"")+r[d],r=r.join(i>2?", ":" "),t.replace(b2,`{
/* [wrapped with `+r+`] */
`)}function ph(t){return ae(t)||Tn(t)||!!(cs&&t&&t[cs])}function tn(t,r){var i=typeof t;return r=r??ye,!!r&&(i=="number"||i!="symbol"&&M2.test(t))&&t>-1&&t%1==0&&t<r}function ut(t,r,i){if(!Fe(i))return!1;var d=typeof r;return(d=="number"?gt(i)&&tn(r,i.length):d=="string"&&r in i)?Ot(i[r],t):!1}function Y0(t,r){if(ae(t))return!1;var i=typeof t;return i=="number"||i=="symbol"||i=="boolean"||t==null||Ct(t)?!0:m2.test(t)||!w2.test(t)||r!=null&&t in Le(r)}function bh(t){var r=typeof t;return r=="string"||r=="number"||r=="symbol"||r=="boolean"?t!=="__proto__":t===null}function Z0(t){var r=vo(t),i=g[r];if(typeof i!="function"||!(r in pe.prototype))return!1;if(t===i)return!0;var d=q0(i);return!!d&&t===d[0]}function $h(t){return!!os&&os in t}var Ch=Kr?nn:ha;function yr(t){var r=t&&t.constructor,i=typeof r=="function"&&r.prototype||Un;return t===i}function o1(t){return t===t&&!Fe(t)}function a1(t,r){return function(i){return i==null?!1:i[t]===r&&(r!==a||t in Le(i))}}function yh(t){var r=So(t,function(d){return i.size===R&&i.clear(),d}),i=r.cache;return r}function Sh(t,r){var i=t[1],d=r[1],f=i|d,w=f<(V|L|q),x=d==q&&i==D||d==q&&i==de&&t[7].length<=r[8]||d==(q|de)&&r[7].length<=r[8]&&i==D;if(!(w||x))return t;d&V&&(t[2]=r[2],f|=i&V?0:_);var p=r[3];if(p){var S=t[3];t[3]=S?zs(S,p,r[4]):p,t[4]=S?hn(t[3],C):r[4]}return p=r[5],p&&(S=t[5],t[5]=S?Ws(S,p,r[6]):p,t[6]=S?hn(t[5],C):r[6]),p=r[7],p&&(t[7]=p),d&q&&(t[8]=t[8]==null?r[8]:ot(t[8],r[8])),t[9]==null&&(t[9]=r[9]),t[0]=r[0],t[1]=f,t}function Rh(t){var r=[];if(t!=null)for(var i in Le(t))r.push(i);return r}function _h(t){return Zr.call(t)}function i1(t,r,i){return r=Qe(r===a?t.length-1:r,0),function(){for(var d=arguments,f=-1,w=Qe(d.length-r,0),x=E(w);++f<w;)x[f]=d[r+f];f=-1;for(var p=E(r+1);++f<r;)p[f]=d[f];return p[r]=i(x),pt(t,this,p)}}function s1(t,r){return r.length<2?t:jn(t,Et(r,0,-1))}function jh(t,r){for(var i=t.length,d=ot(r.length,i),f=ft(t);d--;){var w=r[d];t[d]=tn(w,i)?f[w]:a}return t}function X0(t,r){if(!(r==="constructor"&&typeof t[r]=="function")&&r!="__proto__")return t[r]}var c1=u1(Ms),Sr=Wu||function(t,r){return tt.setTimeout(t,r)},Q0=u1(Xd);function l1(t,r,i){var d=r+"";return Q0(t,vh(d,Ah(wh(d),i)))}function u1(t){var r=0,i=0;return function(){var d=Gu(),f=P-(d-i);if(i=d,f>0){if(++r>=ne)return arguments[0]}else r=0;return t.apply(a,arguments)}}function bo(t,r){var i=-1,d=t.length,f=d-1;for(r=r===a?d:r;++i<r;){var w=L0(i,f),x=t[w];t[w]=t[i],t[i]=x}return t.length=r,t}var d1=yh(function(t){var r=[];return t.charCodeAt(0)===46&&r.push(""),t.replace(x2,function(i,d,f,w){r.push(f?w.replace(R2,"$1"):d||i)}),r});function Gt(t){if(typeof t=="string"||Ct(t))return t;var r=t+"";return r=="0"&&1/t==-we?"-0":r}function In(t){if(t!=null){try{return Yr.call(t)}catch{}try{return t+""}catch{}}return""}function Ah(t,r){return At(ze,function(i){var d="_."+i[0];r&i[1]&&!kr(t,d)&&t.push(d)}),t.sort()}function h1(t){if(t instanceof pe)return t.clone();var r=new Tt(t.__wrapped__,t.__chain__);return r.__actions__=ft(t.__actions__),r.__index__=t.__index__,r.__values__=t.__values__,r}function Ih(t,r,i){(i?ut(t,r,i):r===a)?r=1:r=Qe(ce(r),0);var d=t==null?0:t.length;if(!d||r<1)return[];for(var f=0,w=0,x=E(to(d/r));f<d;)x[w++]=Et(t,f,f+=r);return x}function Th(t){for(var r=-1,i=t==null?0:t.length,d=0,f=[];++r<i;){var w=t[r];w&&(f[d++]=w)}return f}function Mh(){var t=arguments.length;if(!t)return[];for(var r=E(t-1),i=arguments[0],d=t;d--;)r[d-1]=arguments[d];return dn(ae(i)?ft(i):[i],nt(r,1))}var Eh=fe(function(t,r){return ke(t)?vr(t,nt(r,1,ke,!0)):[]}),Lh=fe(function(t,r){var i=Lt(r);return ke(i)&&(i=a),ke(t)?vr(t,nt(r,1,ke,!0),Y(i,2)):[]}),Vh=fe(function(t,r){var i=Lt(r);return ke(i)&&(i=a),ke(t)?vr(t,nt(r,1,ke,!0),a,i):[]});function Bh(t,r,i){var d=t==null?0:t.length;return d?(r=i||r===a?1:ce(r),Et(t,r<0?0:r,d)):[]}function Dh(t,r,i){var d=t==null?0:t.length;return d?(r=i||r===a?1:ce(r),r=d-r,Et(t,0,r<0?0:r)):[]}function Oh(t,r){return t&&t.length?ho(t,Y(r,3),!0,!0):[]}function Hh(t,r){return t&&t.length?ho(t,Y(r,3),!0):[]}function Nh(t,r,i,d){var f=t==null?0:t.length;return f?(i&&typeof i!="number"&&ut(t,r,i)&&(i=0,d=f),Md(t,r,i,d)):[]}function f1(t,r,i){var d=t==null?0:t.length;if(!d)return-1;var f=i==null?0:ce(i);return f<0&&(f=Qe(d+f,0)),Ur(t,Y(r,3),f)}function g1(t,r,i){var d=t==null?0:t.length;if(!d)return-1;var f=d-1;return i!==a&&(f=ce(i),f=i<0?Qe(d+f,0):ot(f,d-1)),Ur(t,Y(r,3),f,!0)}function w1(t){var r=t==null?0:t.length;return r?nt(t,1):[]}function Fh(t){var r=t==null?0:t.length;return r?nt(t,we):[]}function zh(t,r){var i=t==null?0:t.length;return i?(r=r===a?1:ce(r),nt(t,r)):[]}function Wh(t){for(var r=-1,i=t==null?0:t.length,d={};++r<i;){var f=t[r];d[f[0]]=f[1]}return d}function m1(t){return t&&t.length?t[0]:a}function kh(t,r,i){var d=t==null?0:t.length;if(!d)return-1;var f=i==null?0:ce(i);return f<0&&(f=Qe(d+f,0)),Fn(t,r,f)}function Uh(t){var r=t==null?0:t.length;return r?Et(t,0,-1):[]}var qh=fe(function(t){var r=He(t,H0);return r.length&&r[0]===t[0]?A0(r):[]}),Gh=fe(function(t){var r=Lt(t),i=He(t,H0);return r===Lt(i)?r=a:i.pop(),i.length&&i[0]===t[0]?A0(i,Y(r,2)):[]}),Kh=fe(function(t){var r=Lt(t),i=He(t,H0);return r=typeof r=="function"?r:a,r&&i.pop(),i.length&&i[0]===t[0]?A0(i,a,r):[]});function Yh(t,r){return t==null?"":Uu.call(t,r)}function Lt(t){var r=t==null?0:t.length;return r?t[r-1]:a}function Zh(t,r,i){var d=t==null?0:t.length;if(!d)return-1;var f=d;return i!==a&&(f=ce(i),f=f<0?Qe(d+f,0):ot(f,d-1)),r===r?Au(t,r,f):Ur(t,Xi,f,!0)}function Xh(t,r){return t&&t.length?js(t,ce(r)):a}var Qh=fe(x1);function x1(t,r){return t&&t.length&&r&&r.length?E0(t,r):t}function Jh(t,r,i){return t&&t.length&&r&&r.length?E0(t,r,Y(i,2)):t}function Ph(t,r,i){return t&&t.length&&r&&r.length?E0(t,r,a,i):t}var ef=en(function(t,r){var i=t==null?0:t.length,d=S0(t,r);return Ts(t,He(r,function(f){return tn(f,i)?+f:f}).sort(Fs)),d});function tf(t,r){var i=[];if(!(t&&t.length))return i;var d=-1,f=[],w=t.length;for(r=Y(r,3);++d<w;){var x=t[d];r(x,d,t)&&(i.push(x),f.push(d))}return Ts(t,f),i}function J0(t){return t==null?t:Yu.call(t)}function nf(t,r,i){var d=t==null?0:t.length;return d?(i&&typeof i!="number"&&ut(t,r,i)?(r=0,i=d):(r=r==null?0:ce(r),i=i===a?d:ce(i)),Et(t,r,i)):[]}function rf(t,r){return uo(t,r)}function of(t,r,i){return B0(t,r,Y(i,2))}function af(t,r){var i=t==null?0:t.length;if(i){var d=uo(t,r);if(d<i&&Ot(t[d],r))return d}return-1}function sf(t,r){return uo(t,r,!0)}function cf(t,r,i){return B0(t,r,Y(i,2),!0)}function lf(t,r){var i=t==null?0:t.length;if(i){var d=uo(t,r,!0)-1;if(Ot(t[d],r))return d}return-1}function uf(t){return t&&t.length?Es(t):[]}function df(t,r){return t&&t.length?Es(t,Y(r,2)):[]}function hf(t){var r=t==null?0:t.length;return r?Et(t,1,r):[]}function ff(t,r,i){return t&&t.length?(r=i||r===a?1:ce(r),Et(t,0,r<0?0:r)):[]}function gf(t,r,i){var d=t==null?0:t.length;return d?(r=i||r===a?1:ce(r),r=d-r,Et(t,r<0?0:r,d)):[]}function wf(t,r){return t&&t.length?ho(t,Y(r,3),!1,!0):[]}function mf(t,r){return t&&t.length?ho(t,Y(r,3)):[]}var xf=fe(function(t){return wn(nt(t,1,ke,!0))}),vf=fe(function(t){var r=Lt(t);return ke(r)&&(r=a),wn(nt(t,1,ke,!0),Y(r,2))}),pf=fe(function(t){var r=Lt(t);return r=typeof r=="function"?r:a,wn(nt(t,1,ke,!0),a,r)});function bf(t){return t&&t.length?wn(t):[]}function $f(t,r){return t&&t.length?wn(t,Y(r,2)):[]}function Cf(t,r){return r=typeof r=="function"?r:a,t&&t.length?wn(t,a,r):[]}function P0(t){if(!(t&&t.length))return[];var r=0;return t=un(t,function(i){if(ke(i))return r=Qe(i.length,r),!0}),m0(r,function(i){return He(t,f0(i))})}function v1(t,r){if(!(t&&t.length))return[];var i=P0(t);return r==null?i:He(i,function(d){return pt(r,a,d)})}var yf=fe(function(t,r){return ke(t)?vr(t,r):[]}),Sf=fe(function(t){return O0(un(t,ke))}),Rf=fe(function(t){var r=Lt(t);return ke(r)&&(r=a),O0(un(t,ke),Y(r,2))}),_f=fe(function(t){var r=Lt(t);return r=typeof r=="function"?r:a,O0(un(t,ke),a,r)}),jf=fe(P0);function Af(t,r){return Ds(t||[],r||[],xr)}function If(t,r){return Ds(t||[],r||[],$r)}var Tf=fe(function(t){var r=t.length,i=r>1?t[r-1]:a;return i=typeof i=="function"?(t.pop(),i):a,v1(t,i)});function p1(t){var r=g(t);return r.__chain__=!0,r}function Mf(t,r){return r(t),t}function $o(t,r){return r(t)}var Ef=en(function(t){var r=t.length,i=r?t[0]:0,d=this.__wrapped__,f=function(w){return S0(w,t)};return r>1||this.__actions__.length||!(d instanceof pe)||!tn(i)?this.thru(f):(d=d.slice(i,+i+(r?1:0)),d.__actions__.push({func:$o,args:[f],thisArg:a}),new Tt(d,this.__chain__).thru(function(w){return r&&!w.length&&w.push(a),w}))});function Lf(){return p1(this)}function Vf(){return new Tt(this.value(),this.__chain__)}function Bf(){this.__values__===a&&(this.__values__=L1(this.value()));var t=this.__index__>=this.__values__.length,r=t?a:this.__values__[this.__index__++];return{done:t,value:r}}function Df(){return this}function Of(t){for(var r,i=this;i instanceof ao;){var d=h1(i);d.__index__=0,d.__values__=a,r?f.__wrapped__=d:r=d;var f=d;i=i.__wrapped__}return f.__wrapped__=t,r}function Hf(){var t=this.__wrapped__;if(t instanceof pe){var r=t;return this.__actions__.length&&(r=new pe(this)),r=r.reverse(),r.__actions__.push({func:$o,args:[J0],thisArg:a}),new Tt(r,this.__chain__)}return this.thru(J0)}function Nf(){return Bs(this.__wrapped__,this.__actions__)}var Ff=fo(function(t,r,i){Te.call(t,i)?++t[i]:Jt(t,i,1)});function zf(t,r,i){var d=ae(t)?Yi:Td;return i&&ut(t,r,i)&&(r=a),d(t,Y(r,3))}function Wf(t,r){var i=ae(t)?un:vs;return i(t,Y(r,3))}var kf=Gs(f1),Uf=Gs(g1);function qf(t,r){return nt(Co(t,r),1)}function Gf(t,r){return nt(Co(t,r),we)}function Kf(t,r,i){return i=i===a?1:ce(i),nt(Co(t,r),i)}function b1(t,r){var i=ae(t)?At:gn;return i(t,Y(r,3))}function $1(t,r){var i=ae(t)?du:xs;return i(t,Y(r,3))}var Yf=fo(function(t,r,i){Te.call(t,i)?t[i].push(r):Jt(t,i,[r])});function Zf(t,r,i,d){t=gt(t)?t:Jn(t),i=i&&!d?ce(i):0;var f=t.length;return i<0&&(i=Qe(f+i,0)),jo(t)?i<=f&&t.indexOf(r,i)>-1:!!f&&Fn(t,r,i)>-1}var Xf=fe(function(t,r,i){var d=-1,f=typeof r=="function",w=gt(t)?E(t.length):[];return gn(t,function(x){w[++d]=f?pt(r,x,i):pr(x,r,i)}),w}),Qf=fo(function(t,r,i){Jt(t,i,r)});function Co(t,r){var i=ae(t)?He:Ss;return i(t,Y(r,3))}function Jf(t,r,i,d){return t==null?[]:(ae(r)||(r=r==null?[]:[r]),i=d?a:i,ae(i)||(i=i==null?[]:[i]),As(t,r,i))}var Pf=fo(function(t,r,i){t[i?0:1].push(r)},function(){return[[],[]]});function e5(t,r,i){var d=ae(t)?d0:Ji,f=arguments.length<3;return d(t,Y(r,4),i,f,gn)}function t5(t,r,i){var d=ae(t)?hu:Ji,f=arguments.length<3;return d(t,Y(r,4),i,f,xs)}function n5(t,r){var i=ae(t)?un:vs;return i(t,Ro(Y(r,3)))}function r5(t){var r=ae(t)?fs:Yd;return r(t)}function o5(t,r,i){(i?ut(t,r,i):r===a)?r=1:r=ce(r);var d=ae(t)?Rd:Zd;return d(t,r)}function a5(t){var r=ae(t)?_d:Qd;return r(t)}function i5(t){if(t==null)return 0;if(gt(t))return jo(t)?Wn(t):t.length;var r=at(t);return r==Ee||r==ct?t.size:T0(t).length}function s5(t,r,i){var d=ae(t)?h0:Jd;return i&&ut(t,r,i)&&(r=a),d(t,Y(r,3))}var c5=fe(function(t,r){if(t==null)return[];var i=r.length;return i>1&&ut(t,r[0],r[1])?r=[]:i>2&&ut(r[0],r[1],r[2])&&(r=[r[0]]),As(t,nt(r,1),[])}),yo=zu||function(){return tt.Date.now()};function l5(t,r){if(typeof r!="function")throw new It(u);return t=ce(t),function(){if(--t<1)return r.apply(this,arguments)}}function C1(t,r,i){return r=i?a:r,r=t&&r==null?t.length:r,Pt(t,q,a,a,a,a,r)}function y1(t,r){var i;if(typeof r!="function")throw new It(u);return t=ce(t),function(){return--t>0&&(i=r.apply(this,arguments)),t<=1&&(r=a),i}}var ea=fe(function(t,r,i){var d=V;if(i.length){var f=hn(i,Xn(ea));d|=z}return Pt(t,d,r,i,f)}),S1=fe(function(t,r,i){var d=V|L;if(i.length){var f=hn(i,Xn(S1));d|=z}return Pt(r,d,t,i,f)});function R1(t,r,i){r=i?a:r;var d=Pt(t,D,a,a,a,a,a,r);return d.placeholder=R1.placeholder,d}function _1(t,r,i){r=i?a:r;var d=Pt(t,N,a,a,a,a,a,r);return d.placeholder=_1.placeholder,d}function j1(t,r,i){var d,f,w,x,p,S,O=0,H=!1,F=!1,W=!0;if(typeof t!="function")throw new It(u);r=Vt(r)||0,Fe(i)&&(H=!!i.leading,F="maxWait"in i,w=F?Qe(Vt(i.maxWait)||0,r):w,W="trailing"in i?!!i.trailing:W);function U(Ue){var Ht=d,on=f;return d=f=a,O=Ue,x=t.apply(on,Ht),x}function Q(Ue){return O=Ue,p=Sr(ve,r),H?U(Ue):x}function ue(Ue){var Ht=Ue-S,on=Ue-O,G1=r-Ht;return F?ot(G1,w-on):G1}function J(Ue){var Ht=Ue-S,on=Ue-O;return S===a||Ht>=r||Ht<0||F&&on>=w}function ve(){var Ue=yo();if(J(Ue))return be(Ue);p=Sr(ve,ue(Ue))}function be(Ue){return p=a,W&&d?U(Ue):(d=f=a,x)}function yt(){p!==a&&Os(p),O=0,d=S=f=p=a}function dt(){return p===a?x:be(yo())}function St(){var Ue=yo(),Ht=J(Ue);if(d=arguments,f=this,S=Ue,Ht){if(p===a)return Q(S);if(F)return Os(p),p=Sr(ve,r),U(S)}return p===a&&(p=Sr(ve,r)),x}return St.cancel=yt,St.flush=dt,St}var u5=fe(function(t,r){return ms(t,1,r)}),d5=fe(function(t,r,i){return ms(t,Vt(r)||0,i)});function h5(t){return Pt(t,ie)}function So(t,r){if(typeof t!="function"||r!=null&&typeof r!="function")throw new It(u);var i=function(){var d=arguments,f=r?r.apply(this,d):d[0],w=i.cache;if(w.has(f))return w.get(f);var x=t.apply(this,d);return i.cache=w.set(f,x)||w,x};return i.cache=new(So.Cache||Qt),i}So.Cache=Qt;function Ro(t){if(typeof t!="function")throw new It(u);return function(){var r=arguments;switch(r.length){case 0:return!t.call(this);case 1:return!t.call(this,r[0]);case 2:return!t.call(this,r[0],r[1]);case 3:return!t.call(this,r[0],r[1],r[2])}return!t.apply(this,r)}}function f5(t){return y1(2,t)}var g5=Pd(function(t,r){r=r.length==1&&ae(r[0])?He(r[0],bt(Y())):He(nt(r,1),bt(Y()));var i=r.length;return fe(function(d){for(var f=-1,w=ot(d.length,i);++f<w;)d[f]=r[f].call(this,d[f]);return pt(t,this,d)})}),ta=fe(function(t,r){var i=hn(r,Xn(ta));return Pt(t,z,a,r,i)}),A1=fe(function(t,r){var i=hn(r,Xn(A1));return Pt(t,X,a,r,i)}),w5=en(function(t,r){return Pt(t,de,a,a,a,r)});function m5(t,r){if(typeof t!="function")throw new It(u);return r=r===a?r:ce(r),fe(t,r)}function x5(t,r){if(typeof t!="function")throw new It(u);return r=r==null?0:Qe(ce(r),0),fe(function(i){var d=i[r],f=xn(i,0,r);return d&&dn(f,d),pt(t,this,f)})}function v5(t,r,i){var d=!0,f=!0;if(typeof t!="function")throw new It(u);return Fe(i)&&(d="leading"in i?!!i.leading:d,f="trailing"in i?!!i.trailing:f),j1(t,r,{leading:d,maxWait:r,trailing:f})}function p5(t){return C1(t,1)}function b5(t,r){return ta(N0(r),t)}function $5(){if(!arguments.length)return[];var t=arguments[0];return ae(t)?t:[t]}function C5(t){return Mt(t,A)}function y5(t,r){return r=typeof r=="function"?r:a,Mt(t,A,r)}function S5(t){return Mt(t,y|A)}function R5(t,r){return r=typeof r=="function"?r:a,Mt(t,y|A,r)}function _5(t,r){return r==null||ws(t,r,Pe(r))}function Ot(t,r){return t===r||t!==t&&r!==r}var j5=xo(j0),A5=xo(function(t,r){return t>=r}),Tn=$s(function(){return arguments}())?$s:function(t){return We(t)&&Te.call(t,"callee")&&!ss.call(t,"callee")},ae=E.isArray,I5=Wi?bt(Wi):Dd;function gt(t){return t!=null&&_o(t.length)&&!nn(t)}function ke(t){return We(t)&&gt(t)}function T5(t){return t===!0||t===!1||We(t)&&lt(t)==xe}var vn=ku||ha,M5=ki?bt(ki):Od;function E5(t){return We(t)&&t.nodeType===1&&!Rr(t)}function L5(t){if(t==null)return!0;if(gt(t)&&(ae(t)||typeof t=="string"||typeof t.splice=="function"||vn(t)||Qn(t)||Tn(t)))return!t.length;var r=at(t);if(r==Ee||r==ct)return!t.size;if(yr(t))return!T0(t).length;for(var i in t)if(Te.call(t,i))return!1;return!0}function V5(t,r){return br(t,r)}function B5(t,r,i){i=typeof i=="function"?i:a;var d=i?i(t,r):a;return d===a?br(t,r,a,i):!!d}function na(t){if(!We(t))return!1;var r=lt(t);return r==ge||r==oe||typeof t.message=="string"&&typeof t.name=="string"&&!Rr(t)}function D5(t){return typeof t=="number"&&ls(t)}function nn(t){if(!Fe(t))return!1;var r=lt(t);return r==Ce||r==rt||r==K||r==Uo}function I1(t){return typeof t=="number"&&t==ce(t)}function _o(t){return typeof t=="number"&&t>-1&&t%1==0&&t<=ye}function Fe(t){var r=typeof t;return t!=null&&(r=="object"||r=="function")}function We(t){return t!=null&&typeof t=="object"}var T1=Ui?bt(Ui):Nd;function O5(t,r){return t===r||I0(t,r,G0(r))}function H5(t,r,i){return i=typeof i=="function"?i:a,I0(t,r,G0(r),i)}function N5(t){return M1(t)&&t!=+t}function F5(t){if(Ch(t))throw new re(l);return Cs(t)}function z5(t){return t===null}function W5(t){return t==null}function M1(t){return typeof t=="number"||We(t)&&lt(t)==Ae}function Rr(t){if(!We(t)||lt(t)!=Ze)return!1;var r=Jr(t);if(r===null)return!0;var i=Te.call(r,"constructor")&&r.constructor;return typeof i=="function"&&i instanceof i&&Yr.call(i)==Ou}var ra=qi?bt(qi):Fd;function k5(t){return I1(t)&&t>=-ye&&t<=ye}var E1=Gi?bt(Gi):zd;function jo(t){return typeof t=="string"||!ae(t)&&We(t)&&lt(t)==kt}function Ct(t){return typeof t=="symbol"||We(t)&&lt(t)==Hn}var Qn=Ki?bt(Ki):Wd;function U5(t){return t===a}function q5(t){return We(t)&&at(t)==$n}function G5(t){return We(t)&&lt(t)==qo}var K5=xo(M0),Y5=xo(function(t,r){return t<=r});function L1(t){if(!t)return[];if(gt(t))return jo(t)?Bt(t):ft(t);if(hr&&t[hr])return Ru(t[hr]());var r=at(t),i=r==Ee?v0:r==ct?qr:Jn;return i(t)}function rn(t){if(!t)return t===0?t:0;if(t=Vt(t),t===we||t===-we){var r=t<0?-1:1;return r*Me}return t===t?t:0}function ce(t){var r=rn(t),i=r%1;return r===r?i?r-i:r:0}function V1(t){return t?_n(ce(t),0,he):0}function Vt(t){if(typeof t=="number")return t;if(Ct(t))return Be;if(Fe(t)){var r=typeof t.valueOf=="function"?t.valueOf():t;t=Fe(r)?r+"":r}if(typeof t!="string")return t===0?t:+t;t=Pi(t);var i=A2.test(t);return i||T2.test(t)?cu(t.slice(2),i?2:8):j2.test(t)?Be:+t}function B1(t){return qt(t,wt(t))}function Z5(t){return t?_n(ce(t),-ye,ye):t===0?t:0}function Ie(t){return t==null?"":$t(t)}var X5=Yn(function(t,r){if(yr(r)||gt(r)){qt(r,Pe(r),t);return}for(var i in r)Te.call(r,i)&&xr(t,i,r[i])}),D1=Yn(function(t,r){qt(r,wt(r),t)}),Ao=Yn(function(t,r,i,d){qt(r,wt(r),t,d)}),Q5=Yn(function(t,r,i,d){qt(r,Pe(r),t,d)}),J5=en(S0);function P5(t,r){var i=Kn(t);return r==null?i:gs(i,r)}var eg=fe(function(t,r){t=Le(t);var i=-1,d=r.length,f=d>2?r[2]:a;for(f&&ut(r[0],r[1],f)&&(d=1);++i<d;)for(var w=r[i],x=wt(w),p=-1,S=x.length;++p<S;){var O=x[p],H=t[O];(H===a||Ot(H,Un[O])&&!Te.call(t,O))&&(t[O]=w[O])}return t}),tg=fe(function(t){return t.push(a,Ps),pt(O1,a,t)});function ng(t,r){return Zi(t,Y(r,3),Ut)}function rg(t,r){return Zi(t,Y(r,3),_0)}function og(t,r){return t==null?t:R0(t,Y(r,3),wt)}function ag(t,r){return t==null?t:ps(t,Y(r,3),wt)}function ig(t,r){return t&&Ut(t,Y(r,3))}function sg(t,r){return t&&_0(t,Y(r,3))}function cg(t){return t==null?[]:co(t,Pe(t))}function lg(t){return t==null?[]:co(t,wt(t))}function oa(t,r,i){var d=t==null?a:jn(t,r);return d===a?i:d}function ug(t,r){return t!=null&&n1(t,r,Ed)}function aa(t,r){return t!=null&&n1(t,r,Ld)}var dg=Ys(function(t,r,i){r!=null&&typeof r.toString!="function"&&(r=Zr.call(r)),t[r]=i},sa(mt)),hg=Ys(function(t,r,i){r!=null&&typeof r.toString!="function"&&(r=Zr.call(r)),Te.call(t,r)?t[r].push(i):t[r]=[i]},Y),fg=fe(pr);function Pe(t){return gt(t)?hs(t):T0(t)}function wt(t){return gt(t)?hs(t,!0):kd(t)}function gg(t,r){var i={};return r=Y(r,3),Ut(t,function(d,f,w){Jt(i,r(d,f,w),d)}),i}function wg(t,r){var i={};return r=Y(r,3),Ut(t,function(d,f,w){Jt(i,f,r(d,f,w))}),i}var mg=Yn(function(t,r,i){lo(t,r,i)}),O1=Yn(function(t,r,i,d){lo(t,r,i,d)}),xg=en(function(t,r){var i={};if(t==null)return i;var d=!1;r=He(r,function(w){return w=mn(w,t),d||(d=w.length>1),w}),qt(t,U0(t),i),d&&(i=Mt(i,y|b|A,uh));for(var f=r.length;f--;)D0(i,r[f]);return i});function vg(t,r){return H1(t,Ro(Y(r)))}var pg=en(function(t,r){return t==null?{}:qd(t,r)});function H1(t,r){if(t==null)return{};var i=He(U0(t),function(d){return[d]});return r=Y(r),Is(t,i,function(d,f){return r(d,f[0])})}function bg(t,r,i){r=mn(r,t);var d=-1,f=r.length;for(f||(f=1,t=a);++d<f;){var w=t==null?a:t[Gt(r[d])];w===a&&(d=f,w=i),t=nn(w)?w.call(t):w}return t}function $g(t,r,i){return t==null?t:$r(t,r,i)}function Cg(t,r,i,d){return d=typeof d=="function"?d:a,t==null?t:$r(t,r,i,d)}var N1=Qs(Pe),F1=Qs(wt);function yg(t,r,i){var d=ae(t),f=d||vn(t)||Qn(t);if(r=Y(r,4),i==null){var w=t&&t.constructor;f?i=d?new w:[]:Fe(t)?i=nn(w)?Kn(Jr(t)):{}:i={}}return(f?At:Ut)(t,function(x,p,S){return r(i,x,p,S)}),i}function Sg(t,r){return t==null?!0:D0(t,r)}function Rg(t,r,i){return t==null?t:Vs(t,r,N0(i))}function _g(t,r,i,d){return d=typeof d=="function"?d:a,t==null?t:Vs(t,r,N0(i),d)}function Jn(t){return t==null?[]:x0(t,Pe(t))}function jg(t){return t==null?[]:x0(t,wt(t))}function Ag(t,r,i){return i===a&&(i=r,r=a),i!==a&&(i=Vt(i),i=i===i?i:0),r!==a&&(r=Vt(r),r=r===r?r:0),_n(Vt(t),r,i)}function Ig(t,r,i){return r=rn(r),i===a?(i=r,r=0):i=rn(i),t=Vt(t),Vd(t,r,i)}function Tg(t,r,i){if(i&&typeof i!="boolean"&&ut(t,r,i)&&(r=i=a),i===a&&(typeof r=="boolean"?(i=r,r=a):typeof t=="boolean"&&(i=t,t=a)),t===a&&r===a?(t=0,r=1):(t=rn(t),r===a?(r=t,t=0):r=rn(r)),t>r){var d=t;t=r,r=d}if(i||t%1||r%1){var f=us();return ot(t+f*(r-t+su("1e-"+((f+"").length-1))),r)}return L0(t,r)}var Mg=Zn(function(t,r,i){return r=r.toLowerCase(),t+(i?z1(r):r)});function z1(t){return ia(Ie(t).toLowerCase())}function W1(t){return t=Ie(t),t&&t.replace(E2,bu).replace(Q2,"")}function Eg(t,r,i){t=Ie(t),r=$t(r);var d=t.length;i=i===a?d:_n(ce(i),0,d);var f=i;return i-=r.length,i>=0&&t.slice(i,f)==r}function Lg(t){return t=Ie(t),t&&h2.test(t)?t.replace(pi,$u):t}function Vg(t){return t=Ie(t),t&&v2.test(t)?t.replace(t0,"\\$&"):t}var Bg=Zn(function(t,r,i){return t+(i?"-":"")+r.toLowerCase()}),Dg=Zn(function(t,r,i){return t+(i?" ":"")+r.toLowerCase()}),Og=qs("toLowerCase");function Hg(t,r,i){t=Ie(t),r=ce(r);var d=r?Wn(t):0;if(!r||d>=r)return t;var f=(r-d)/2;return mo(no(f),i)+t+mo(to(f),i)}function Ng(t,r,i){t=Ie(t),r=ce(r);var d=r?Wn(t):0;return r&&d<r?t+mo(r-d,i):t}function Fg(t,r,i){t=Ie(t),r=ce(r);var d=r?Wn(t):0;return r&&d<r?mo(r-d,i)+t:t}function zg(t,r,i){return i||r==null?r=0:r&&(r=+r),Ku(Ie(t).replace(n0,""),r||0)}function Wg(t,r,i){return(i?ut(t,r,i):r===a)?r=1:r=ce(r),V0(Ie(t),r)}function kg(){var t=arguments,r=Ie(t[0]);return t.length<3?r:r.replace(t[1],t[2])}var Ug=Zn(function(t,r,i){return t+(i?"_":"")+r.toLowerCase()});function qg(t,r,i){return i&&typeof i!="number"&&ut(t,r,i)&&(r=i=a),i=i===a?he:i>>>0,i?(t=Ie(t),t&&(typeof r=="string"||r!=null&&!ra(r))&&(r=$t(r),!r&&zn(t))?xn(Bt(t),0,i):t.split(r,i)):[]}var Gg=Zn(function(t,r,i){return t+(i?" ":"")+ia(r)});function Kg(t,r,i){return t=Ie(t),i=i==null?0:_n(ce(i),0,t.length),r=$t(r),t.slice(i,i+r.length)==r}function Yg(t,r,i){var d=g.templateSettings;i&&ut(t,r,i)&&(r=a),t=Ie(t),r=Ao({},r,d,Js);var f=Ao({},r.imports,d.imports,Js),w=Pe(f),x=x0(f,w),p,S,O=0,H=r.interpolate||Fr,F="__p += '",W=p0((r.escape||Fr).source+"|"+H.source+"|"+(H===bi?_2:Fr).source+"|"+(r.evaluate||Fr).source+"|$","g"),U="//# sourceURL="+(Te.call(r,"sourceURL")?(r.sourceURL+"").replace(/\s/g," "):"lodash.templateSources["+ ++nu+"]")+`
`;t.replace(W,function(J,ve,be,yt,dt,St){return be||(be=yt),F+=t.slice(O,St).replace(L2,Cu),ve&&(p=!0,F+=`' +
__e(`+ve+`) +
'`),dt&&(S=!0,F+=`';
`+dt+`;
__p += '`),be&&(F+=`' +
((__t = (`+be+`)) == null ? '' : __t) +
'`),O=St+J.length,J}),F+=`';
`;var Q=Te.call(r,"variable")&&r.variable;if(!Q)F=`with (obj) {
`+F+`
}
`;else if(S2.test(Q))throw new re(m);F=(S?F.replace(c2,""):F).replace(l2,"$1").replace(u2,"$1;"),F="function("+(Q||"obj")+`) {
`+(Q?"":`obj || (obj = {});
`)+"var __t, __p = ''"+(p?", __e = _.escape":"")+(S?`, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
`:`;
`)+F+`return __p
}`;var ue=U1(function(){return Re(w,U+"return "+F).apply(a,x)});if(ue.source=F,na(ue))throw ue;return ue}function Zg(t){return Ie(t).toLowerCase()}function Xg(t){return Ie(t).toUpperCase()}function Qg(t,r,i){if(t=Ie(t),t&&(i||r===a))return Pi(t);if(!t||!(r=$t(r)))return t;var d=Bt(t),f=Bt(r),w=es(d,f),x=ts(d,f)+1;return xn(d,w,x).join("")}function Jg(t,r,i){if(t=Ie(t),t&&(i||r===a))return t.slice(0,rs(t)+1);if(!t||!(r=$t(r)))return t;var d=Bt(t),f=ts(d,Bt(r))+1;return xn(d,0,f).join("")}function Pg(t,r,i){if(t=Ie(t),t&&(i||r===a))return t.replace(n0,"");if(!t||!(r=$t(r)))return t;var d=Bt(t),f=es(d,Bt(r));return xn(d,f).join("")}function e3(t,r){var i=se,d=$e;if(Fe(r)){var f="separator"in r?r.separator:f;i="length"in r?ce(r.length):i,d="omission"in r?$t(r.omission):d}t=Ie(t);var w=t.length;if(zn(t)){var x=Bt(t);w=x.length}if(i>=w)return t;var p=i-Wn(d);if(p<1)return d;var S=x?xn(x,0,p).join(""):t.slice(0,p);if(f===a)return S+d;if(x&&(p+=S.length-p),ra(f)){if(t.slice(p).search(f)){var O,H=S;for(f.global||(f=p0(f.source,Ie($i.exec(f))+"g")),f.lastIndex=0;O=f.exec(H);)var F=O.index;S=S.slice(0,F===a?p:F)}}else if(t.indexOf($t(f),p)!=p){var W=S.lastIndexOf(f);W>-1&&(S=S.slice(0,W))}return S+d}function t3(t){return t=Ie(t),t&&d2.test(t)?t.replace(vi,Iu):t}var n3=Zn(function(t,r,i){return t+(i?" ":"")+r.toUpperCase()}),ia=qs("toUpperCase");function k1(t,r,i){return t=Ie(t),r=i?a:r,r===a?Su(t)?Eu(t):wu(t):t.match(r)||[]}var U1=fe(function(t,r){try{return pt(t,a,r)}catch(i){return na(i)?i:new re(i)}}),r3=en(function(t,r){return At(r,function(i){i=Gt(i),Jt(t,i,ea(t[i],t))}),t});function o3(t){var r=t==null?0:t.length,i=Y();return t=r?He(t,function(d){if(typeof d[1]!="function")throw new It(u);return[i(d[0]),d[1]]}):[],fe(function(d){for(var f=-1;++f<r;){var w=t[f];if(pt(w[0],this,d))return pt(w[1],this,d)}})}function a3(t){return Id(Mt(t,y))}function sa(t){return function(){return t}}function i3(t,r){return t==null||t!==t?r:t}var s3=Ks(),c3=Ks(!0);function mt(t){return t}function ca(t){return ys(typeof t=="function"?t:Mt(t,y))}function l3(t){return Rs(Mt(t,y))}function u3(t,r){return _s(t,Mt(r,y))}var d3=fe(function(t,r){return function(i){return pr(i,t,r)}}),h3=fe(function(t,r){return function(i){return pr(t,i,r)}});function la(t,r,i){var d=Pe(r),f=co(r,d);i==null&&!(Fe(r)&&(f.length||!d.length))&&(i=r,r=t,t=this,f=co(r,Pe(r)));var w=!(Fe(i)&&"chain"in i)||!!i.chain,x=nn(t);return At(f,function(p){var S=r[p];t[p]=S,x&&(t.prototype[p]=function(){var O=this.__chain__;if(w||O){var H=t(this.__wrapped__),F=H.__actions__=ft(this.__actions__);return F.push({func:S,args:arguments,thisArg:t}),H.__chain__=O,H}return S.apply(t,dn([this.value()],arguments))})}),t}function f3(){return tt._===this&&(tt._=Hu),this}function ua(){}function g3(t){return t=ce(t),fe(function(r){return js(r,t)})}var w3=z0(He),m3=z0(Yi),x3=z0(h0);function q1(t){return Y0(t)?f0(Gt(t)):Gd(t)}function v3(t){return function(r){return t==null?a:jn(t,r)}}var p3=Zs(),b3=Zs(!0);function da(){return[]}function ha(){return!1}function $3(){return{}}function C3(){return""}function y3(){return!0}function S3(t,r){if(t=ce(t),t<1||t>ye)return[];var i=he,d=ot(t,he);r=Y(r),t-=he;for(var f=m0(d,r);++i<t;)r(i);return f}function R3(t){return ae(t)?He(t,Gt):Ct(t)?[t]:ft(d1(Ie(t)))}function _3(t){var r=++Du;return Ie(t)+r}var j3=wo(function(t,r){return t+r},0),A3=W0("ceil"),I3=wo(function(t,r){return t/r},1),T3=W0("floor");function M3(t){return t&&t.length?so(t,mt,j0):a}function E3(t,r){return t&&t.length?so(t,Y(r,2),j0):a}function L3(t){return Qi(t,mt)}function V3(t,r){return Qi(t,Y(r,2))}function B3(t){return t&&t.length?so(t,mt,M0):a}function D3(t,r){return t&&t.length?so(t,Y(r,2),M0):a}var O3=wo(function(t,r){return t*r},1),H3=W0("round"),N3=wo(function(t,r){return t-r},0);function F3(t){return t&&t.length?w0(t,mt):0}function z3(t,r){return t&&t.length?w0(t,Y(r,2)):0}return g.after=l5,g.ary=C1,g.assign=X5,g.assignIn=D1,g.assignInWith=Ao,g.assignWith=Q5,g.at=J5,g.before=y1,g.bind=ea,g.bindAll=r3,g.bindKey=S1,g.castArray=$5,g.chain=p1,g.chunk=Ih,g.compact=Th,g.concat=Mh,g.cond=o3,g.conforms=a3,g.constant=sa,g.countBy=Ff,g.create=P5,g.curry=R1,g.curryRight=_1,g.debounce=j1,g.defaults=eg,g.defaultsDeep=tg,g.defer=u5,g.delay=d5,g.difference=Eh,g.differenceBy=Lh,g.differenceWith=Vh,g.drop=Bh,g.dropRight=Dh,g.dropRightWhile=Oh,g.dropWhile=Hh,g.fill=Nh,g.filter=Wf,g.flatMap=qf,g.flatMapDeep=Gf,g.flatMapDepth=Kf,g.flatten=w1,g.flattenDeep=Fh,g.flattenDepth=zh,g.flip=h5,g.flow=s3,g.flowRight=c3,g.fromPairs=Wh,g.functions=cg,g.functionsIn=lg,g.groupBy=Yf,g.initial=Uh,g.intersection=qh,g.intersectionBy=Gh,g.intersectionWith=Kh,g.invert=dg,g.invertBy=hg,g.invokeMap=Xf,g.iteratee=ca,g.keyBy=Qf,g.keys=Pe,g.keysIn=wt,g.map=Co,g.mapKeys=gg,g.mapValues=wg,g.matches=l3,g.matchesProperty=u3,g.memoize=So,g.merge=mg,g.mergeWith=O1,g.method=d3,g.methodOf=h3,g.mixin=la,g.negate=Ro,g.nthArg=g3,g.omit=xg,g.omitBy=vg,g.once=f5,g.orderBy=Jf,g.over=w3,g.overArgs=g5,g.overEvery=m3,g.overSome=x3,g.partial=ta,g.partialRight=A1,g.partition=Pf,g.pick=pg,g.pickBy=H1,g.property=q1,g.propertyOf=v3,g.pull=Qh,g.pullAll=x1,g.pullAllBy=Jh,g.pullAllWith=Ph,g.pullAt=ef,g.range=p3,g.rangeRight=b3,g.rearg=w5,g.reject=n5,g.remove=tf,g.rest=m5,g.reverse=J0,g.sampleSize=o5,g.set=$g,g.setWith=Cg,g.shuffle=a5,g.slice=nf,g.sortBy=c5,g.sortedUniq=uf,g.sortedUniqBy=df,g.split=qg,g.spread=x5,g.tail=hf,g.take=ff,g.takeRight=gf,g.takeRightWhile=wf,g.takeWhile=mf,g.tap=Mf,g.throttle=v5,g.thru=$o,g.toArray=L1,g.toPairs=N1,g.toPairsIn=F1,g.toPath=R3,g.toPlainObject=B1,g.transform=yg,g.unary=p5,g.union=xf,g.unionBy=vf,g.unionWith=pf,g.uniq=bf,g.uniqBy=$f,g.uniqWith=Cf,g.unset=Sg,g.unzip=P0,g.unzipWith=v1,g.update=Rg,g.updateWith=_g,g.values=Jn,g.valuesIn=jg,g.without=yf,g.words=k1,g.wrap=b5,g.xor=Sf,g.xorBy=Rf,g.xorWith=_f,g.zip=jf,g.zipObject=Af,g.zipObjectDeep=If,g.zipWith=Tf,g.entries=N1,g.entriesIn=F1,g.extend=D1,g.extendWith=Ao,la(g,g),g.add=j3,g.attempt=U1,g.camelCase=Mg,g.capitalize=z1,g.ceil=A3,g.clamp=Ag,g.clone=C5,g.cloneDeep=S5,g.cloneDeepWith=R5,g.cloneWith=y5,g.conformsTo=_5,g.deburr=W1,g.defaultTo=i3,g.divide=I3,g.endsWith=Eg,g.eq=Ot,g.escape=Lg,g.escapeRegExp=Vg,g.every=zf,g.find=kf,g.findIndex=f1,g.findKey=ng,g.findLast=Uf,g.findLastIndex=g1,g.findLastKey=rg,g.floor=T3,g.forEach=b1,g.forEachRight=$1,g.forIn=og,g.forInRight=ag,g.forOwn=ig,g.forOwnRight=sg,g.get=oa,g.gt=j5,g.gte=A5,g.has=ug,g.hasIn=aa,g.head=m1,g.identity=mt,g.includes=Zf,g.indexOf=kh,g.inRange=Ig,g.invoke=fg,g.isArguments=Tn,g.isArray=ae,g.isArrayBuffer=I5,g.isArrayLike=gt,g.isArrayLikeObject=ke,g.isBoolean=T5,g.isBuffer=vn,g.isDate=M5,g.isElement=E5,g.isEmpty=L5,g.isEqual=V5,g.isEqualWith=B5,g.isError=na,g.isFinite=D5,g.isFunction=nn,g.isInteger=I1,g.isLength=_o,g.isMap=T1,g.isMatch=O5,g.isMatchWith=H5,g.isNaN=N5,g.isNative=F5,g.isNil=W5,g.isNull=z5,g.isNumber=M1,g.isObject=Fe,g.isObjectLike=We,g.isPlainObject=Rr,g.isRegExp=ra,g.isSafeInteger=k5,g.isSet=E1,g.isString=jo,g.isSymbol=Ct,g.isTypedArray=Qn,g.isUndefined=U5,g.isWeakMap=q5,g.isWeakSet=G5,g.join=Yh,g.kebabCase=Bg,g.last=Lt,g.lastIndexOf=Zh,g.lowerCase=Dg,g.lowerFirst=Og,g.lt=K5,g.lte=Y5,g.max=M3,g.maxBy=E3,g.mean=L3,g.meanBy=V3,g.min=B3,g.minBy=D3,g.stubArray=da,g.stubFalse=ha,g.stubObject=$3,g.stubString=C3,g.stubTrue=y3,g.multiply=O3,g.nth=Xh,g.noConflict=f3,g.noop=ua,g.now=yo,g.pad=Hg,g.padEnd=Ng,g.padStart=Fg,g.parseInt=zg,g.random=Tg,g.reduce=e5,g.reduceRight=t5,g.repeat=Wg,g.replace=kg,g.result=bg,g.round=H3,g.runInContext=$,g.sample=r5,g.size=i5,g.snakeCase=Ug,g.some=s5,g.sortedIndex=rf,g.sortedIndexBy=of,g.sortedIndexOf=af,g.sortedLastIndex=sf,g.sortedLastIndexBy=cf,g.sortedLastIndexOf=lf,g.startCase=Gg,g.startsWith=Kg,g.subtract=N3,g.sum=F3,g.sumBy=z3,g.template=Yg,g.times=S3,g.toFinite=rn,g.toInteger=ce,g.toLength=V1,g.toLower=Zg,g.toNumber=Vt,g.toSafeInteger=Z5,g.toString=Ie,g.toUpper=Xg,g.trim=Qg,g.trimEnd=Jg,g.trimStart=Pg,g.truncate=e3,g.unescape=t3,g.uniqueId=_3,g.upperCase=n3,g.upperFirst=ia,g.each=b1,g.eachRight=$1,g.first=m1,la(g,function(){var t={};return Ut(g,function(r,i){Te.call(g.prototype,i)||(t[i]=r)}),t}(),{chain:!1}),g.VERSION=c,At(["bind","bindKey","curry","curryRight","partial","partialRight"],function(t){g[t].placeholder=g}),At(["drop","take"],function(t,r){pe.prototype[t]=function(i){i=i===a?1:Qe(ce(i),0);var d=this.__filtered__&&!r?new pe(this):this.clone();return d.__filtered__?d.__takeCount__=ot(i,d.__takeCount__):d.__views__.push({size:ot(i,he),type:t+(d.__dir__<0?"Right":"")}),d},pe.prototype[t+"Right"]=function(i){return this.reverse()[t](i).reverse()}}),At(["filter","map","takeWhile"],function(t,r){var i=r+1,d=i==ee||i==je;pe.prototype[t]=function(f){var w=this.clone();return w.__iteratees__.push({iteratee:Y(f,3),type:i}),w.__filtered__=w.__filtered__||d,w}}),At(["head","last"],function(t,r){var i="take"+(r?"Right":"");pe.prototype[t]=function(){return this[i](1).value()[0]}}),At(["initial","tail"],function(t,r){var i="drop"+(r?"":"Right");pe.prototype[t]=function(){return this.__filtered__?new pe(this):this[i](1)}}),pe.prototype.compact=function(){return this.filter(mt)},pe.prototype.find=function(t){return this.filter(t).head()},pe.prototype.findLast=function(t){return this.reverse().find(t)},pe.prototype.invokeMap=fe(function(t,r){return typeof t=="function"?new pe(this):this.map(function(i){return pr(i,t,r)})}),pe.prototype.reject=function(t){return this.filter(Ro(Y(t)))},pe.prototype.slice=function(t,r){t=ce(t);var i=this;return i.__filtered__&&(t>0||r<0)?new pe(i):(t<0?i=i.takeRight(-t):t&&(i=i.drop(t)),r!==a&&(r=ce(r),i=r<0?i.dropRight(-r):i.take(r-t)),i)},pe.prototype.takeRightWhile=function(t){return this.reverse().takeWhile(t).reverse()},pe.prototype.toArray=function(){return this.take(he)},Ut(pe.prototype,function(t,r){var i=/^(?:filter|find|map|reject)|While$/.test(r),d=/^(?:head|last)$/.test(r),f=g[d?"take"+(r=="last"?"Right":""):r],w=d||/^find/.test(r);f&&(g.prototype[r]=function(){var x=this.__wrapped__,p=d?[1]:arguments,S=x instanceof pe,O=p[0],H=S||ae(x),F=function(ve){var be=f.apply(g,dn([ve],p));return d&&W?be[0]:be};H&&i&&typeof O=="function"&&O.length!=1&&(S=H=!1);var W=this.__chain__,U=!!this.__actions__.length,Q=w&&!W,ue=S&&!U;if(!w&&H){x=ue?x:new pe(this);var J=t.apply(x,p);return J.__actions__.push({func:$o,args:[F],thisArg:a}),new Tt(J,W)}return Q&&ue?t.apply(this,p):(J=this.thru(F),Q?d?J.value()[0]:J.value():J)})}),At(["pop","push","shift","sort","splice","unshift"],function(t){var r=Gr[t],i=/^(?:push|sort|unshift)$/.test(t)?"tap":"thru",d=/^(?:pop|shift)$/.test(t);g.prototype[t]=function(){var f=arguments;if(d&&!this.__chain__){var w=this.value();return r.apply(ae(w)?w:[],f)}return this[i](function(x){return r.apply(ae(x)?x:[],f)})}}),Ut(pe.prototype,function(t,r){var i=g[r];if(i){var d=i.name+"";Te.call(Gn,d)||(Gn[d]=[]),Gn[d].push({name:r,func:i})}}),Gn[go(a,L).name]=[{name:"wrapper",func:a}],pe.prototype.clone=ed,pe.prototype.reverse=td,pe.prototype.value=nd,g.prototype.at=Ef,g.prototype.chain=Lf,g.prototype.commit=Vf,g.prototype.next=Bf,g.prototype.plant=Of,g.prototype.reverse=Hf,g.prototype.toJSON=g.prototype.valueOf=g.prototype.value=Nf,g.prototype.first=g.prototype.head,hr&&(g.prototype[hr]=Df),g},kn=Lu();Cn?((Cn.exports=kn)._=kn,c0._=kn):tt._=kn}).call(_r)})(Vo,Vo.exports);Vo.exports;const bn=(e="&")=>({theme:n,$hasError:a=!1})=>te`
    outline: none;
    box-shadow: none;
    transition-property: border-color, box-shadow, fill;
    transition-duration: 0.2s;

    ${e}:focus-within {
      border: 1px solid ${a?n.colors.danger600:n.colors.primary600};
      box-shadow: ${a?n.colors.danger600:n.colors.primary600} 0px 0px 0px 2px;
    }
  `,[R7,vt]=Br("Field",{}),Bn=h.forwardRef(({children:e,name:n,error:a=!1,hint:c,id:o,required:l=!1,...u},m)=>{const v=Wt(o),[R,C]=h.useState();return s.jsx(R7,{name:n,id:v,error:a,hint:c,required:l,labelNode:R,setLabelNode:C,children:s.jsx(G,{direction:"column",alignItems:"stretch",gap:1,ref:m,...u,children:e})})}),fi=h.forwardRef(({children:e,action:n,...a},c)=>{const{id:o,required:l,setLabelNode:u}=vt("Label"),m=xt(c,u);return e?s.jsxs(_7,{ref:m,variant:"pi",textColor:"neutral800",fontWeight:"bold",...a,id:`${o}-label`,htmlFor:o,tag:"label",ellipsis:!0,children:[e,l&&s.jsx(le,{"aria-hidden":!0,lineHeight:"1em",textColor:"danger600",children:"*"}),n&&s.jsx(j7,{marginLeft:1,children:n})]}):null}),_7=I(le)`
  display: flex;
`,j7=I(G)`
  line-height: 0;
  color: ${({theme:e})=>e.colors.neutral500};
`,Wo=h.forwardRef(({endAction:e,startAction:n,disabled:a=!1,onChange:c,hasError:o,required:l,className:u,size:m="M",...v},R)=>{const{id:C,error:y,hint:b,name:A,required:T}=vt("Input");let M;y?M=`${C}-error`:b&&(M=`${C}-hint`);const V=!!y,L=h.useRef(null),_=h.useRef(null),D=xt(_,R),N=z=>{!a&&c&&c(z)};return h.useLayoutEffect(()=>{if(L.current&&_.current){const z=L.current.offsetWidth,X=_.current;if(X){const q=z+8+16;X.style.paddingRight=`${q}px`}}},[e]),s.jsxs(T7,{gap:2,justifyContent:"space-between",$hasError:V||o,$disabled:a,$size:m,$hasLeftAction:!!n,$hasRightAction:!!e,className:u,children:[n,s.jsx(A7,{id:C,name:A,ref:D,$size:m,"aria-describedby":M,"aria-invalid":V||o,"aria-disabled":a,disabled:a,"data-disabled":a?"":void 0,onChange:N,"aria-required":T||l,$hasLeftAction:!!n,$hasRightAction:!!e,...v}),e&&s.jsx(I7,{ref:L,children:e})]})}),A7=I.input`
  border: none;
  border-radius: ${({theme:e})=>e.borderRadius};
  cursor: ${e=>e["aria-disabled"]?"not-allowed":void 0};

  color: ${({theme:e})=>e.colors.neutral800};
  font-weight: 400;
  font-size: ${e=>e.theme.fontSizes[2]};
  line-height: 2.2rem;
  display: block;
  width: 100%;
  background: inherit;

  ::placeholder {
    color: ${({theme:e})=>e.colors.neutral500};
    opacity: 1;
  }

  &[aria-disabled='true'] {
    color: inherit;
  }

  //focus managed by InputWrapper
  &:focus {
    outline: none;
    box-shadow: none;
  }

  ${e=>{switch(e.$size){case"S":return te`
          padding-inline-start: ${e.$hasLeftAction?0:e.theme.spaces[4]};
          padding-inline-end: ${e.$hasRightAction?0:e.theme.spaces[4]};
          padding-block: ${e.theme.spaces[1]};
        `;default:return te`
          padding-inline-start: ${e.$hasLeftAction?0:e.theme.spaces[4]};
          padding-inline-end: ${e.$hasRightAction?0:e.theme.spaces[4]};
          padding-block: ${e.theme.spaces[2]};
        `}}}
`,I7=I(G)`
  position: absolute;
  right: ${({theme:e})=>e.spaces[4]};
  top: 50%;
  transform: translateY(-50%);
`,T7=I(G)`
  border: 1px solid ${({theme:e,$hasError:n})=>n?e.colors.danger600:e.colors.neutral200};
  border-radius: ${({theme:e})=>e.borderRadius};
  background: ${({theme:e})=>e.colors.neutral0};
  padding-inline-start: ${({$hasLeftAction:e,theme:n})=>e?n.spaces[4]:0};
  position: relative;

  ${bn()}
  ${({theme:e,$disabled:n})=>n?te`
          color: ${e.colors.neutral600};
          background: ${e.colors.neutral150};
        `:void 0};
`,Dl=()=>{const{id:e,hint:n,error:a}=vt("Hint");return!n||a?null:s.jsx(le,{variant:"pi",tag:"p",id:`${e}-hint`,textColor:"neutral600",children:n})},Ol=()=>{const{id:e,error:n}=vt("Error");return!n||typeof n!="string"?null:s.jsx(le,{variant:"pi",tag:"p",id:`${e}-error`,textColor:"danger600","data-strapi-field-error":!0,children:n})},Hl=h.forwardRef(({label:e,children:n,...a},c)=>s.jsx(M7,{justifyContent:"unset",background:"transparent",borderStyle:"none",...a,type:"button",tag:"button",ref:c,children:s.jsx(nr,{label:e,children:n})})),M7=I(G)`
  font-size: 1.6rem;
  padding: 0;
`,Vb=Object.freeze(Object.defineProperty({__proto__:null,Action:Hl,Error:Ol,Hint:Dl,Input:Wo,Label:fi,Root:Bn,useField:vt},Symbol.toStringTag,{value:"Module"}));h.forwardRef(({actions:e,children:n,error:a,hint:c,label:o,labelAction:l,nextLabel:u,onNext:m,onPrevious:v,previousLabel:R,required:C,secondaryLabel:y,selectedSlide:b,id:A,...T},M)=>{const V=Wt(A);return s.jsx(Bn,{hint:c,error:a,id:V,required:C,children:s.jsxs(G,{direction:"column",alignItems:"stretch",gap:1,children:[o&&s.jsx(fi,{action:l,children:o}),s.jsx(S7,{ref:M,actions:e,label:o,nextLabel:u,onNext:m,onPrevious:v,previousLabel:R,secondaryLabel:y,selectedSlide:b,id:V,...T,children:n}),s.jsx(Dl,{}),s.jsx(Ol,{})]})})});I(Z)`
  ${wl}
`;const E7="data:image/svg+xml,%3csvg%20width='63'%20height='63'%20viewBox='0%200%2063%2063'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M42.5563%2011.9816C39.484%2010.3071%2035.8575%209.29097%2032.3354%209.13521C28.6443%208.92888%2024.8295%209.72318%2021.3336%2011.4129C20.9123%2011.5901%2020.5376%2011.8101%2020.1722%2012.0249L20.0108%2012.1179C19.8774%2012.1951%2019.7441%2012.2724%2019.608%2012.3536C19.3253%2012.5146%2019.0492%2012.6744%2018.7544%2012.8792C18.5463%2013.0329%2018.3395%2013.1759%2018.1301%2013.323C17.5658%2013.7208%2016.9868%2014.1317%2016.4983%2014.5979C14.8476%2015.9524%2013.5571%2017.6075%2012.6071%2018.9214C10.4365%2022.1566%209.08622%2025.9567%208.80702%2029.6143L8.7764%2030.1588C8.73328%2030.9196%208.68476%2031.7057%208.75353%2032.4555C8.76648%2032.6084%208.7661%2032.7638%208.77506%2032.914C8.78895%2033.229%208.80152%2033.5373%208.846%2033.8672L9.07396%2035.4221C9.09756%2035.5764%209.1198%2035.7413%209.1633%2035.9263L9.65919%2037.9272L10.138%2039.2823C10.2729%2039.6673%2010.4158%2040.0751%2010.6%2040.43C12.0292%2043.637%2014.1425%2046.4578%2016.7063%2048.585C19.0508%2050.5296%2021.824%2052.0023%2024.7491%2052.8452L26.2371%2053.2376C26.3781%2053.2693%2026.4926%2053.2889%2026.6031%2053.3058L26.7775%2053.3311C27.0052%2053.3636%2027.2195%2053.3986%2027.4445%2053.435C27.8598%2053.5076%2028.2672%2053.5748%2028.7079%2053.6183L30.5641%2053.7229C30.9516%2053.7249%2031.3352%2053.7068%2031.7081%2053.6874C31.9039%2053.681%2032.0984%2053.6681%2032.3288%2053.662C34.5253%2053.4772%2036.5106%2053.0634%2038.0516%2052.4652C38.1769%2052.4171%2038.3008%2052.3796%2038.4234%2052.3355C38.6727%2052.2499%2038.9259%2052.167%2039.1432%2052.0599L40.8591%2051.2626L42.5702%2050.266C42.9009%2050.0682%2043.0205%2049.6414%2042.8282%2049.2984C42.632%2048.9526%2042.2034%2048.8308%2041.8634%2049.0166L40.1792%2049.9218L38.4995%2050.6224C38.3169%2050.6953%2038.121%2050.7534%2037.9224%2050.8155C37.7838%2050.8489%2037.6518%2050.8983%2037.5012%2050.9408C36.0711%2051.435%2034.2445%2051.7425%2032.244%2051.8346C32.0442%2051.8383%2031.8471%2051.8379%2031.654%2051.8403C31.3051%2051.8414%2030.9602%2051.8451%2030.6392%2051.8305L28.9177%2051.6725C28.5476%2051.619%2028.1695%2051.5427%2027.7848%2051.4678C27.5639%2051.4167%2027.3376%2051.3737%2027.1299%2051.3374L26.9529%2051.2987C26.8704%2051.2834%2026.7772%2051.2667%2026.7333%2051.2543L25.3466%2050.8322C22.7651%2049.9789%2020.33%2048.5729%2018.2942%2046.7557C16.1056%2044.7951%2014.3339%2042.2335%2013.1742%2039.3582C12.0276%2036.6013%2011.5988%2033.2792%2011.9716%2030.0076C12.3145%2027.0213%2013.3948%2024.1635%2015.1858%2021.5083C15.3034%2021.3339%2015.421%2021.1596%2015.5212%2021.0196C16.4309%2019.8688%2017.5408%2018.5589%2018.9483%2017.496C19.3367%2017.1525%2019.7862%2016.856%2020.2611%2016.5478C20.4878%2016.4009%2020.7079%2016.2553%2020.8907%2016.1306C21.0974%2016.0048%2021.3188%2015.8831%2021.5348%2015.7694C21.6761%2015.6975%2021.8162%2015.619%2021.9388%2015.5576L22.1002%2015.4646C22.4002%2015.3037%2022.6749%2015.1546%2022.9908%2015.039L24.1186%2014.5715C24.3399%2014.4844%2024.5718%2014.4159%2024.7997%2014.3447C24.953%2014.2982%2025.0982%2014.2635%2025.2635%2014.2078C25.786%2014.0182%2026.3283%2013.9112%2026.9105%2013.7965C27.117%2013.7571%2027.3302%2013.7163%2027.5608%2013.6585C27.7553%2013.611%2027.9737%2013.5969%2028.2082%2013.5762C28.364%2013.5603%2028.5172%2013.5483%2028.6318%2013.5333C28.7876%2013.5173%2028.9342%2013.5066%2029.0927%2013.4867C29.3285%2013.4555%2029.5456%2013.4347%2029.7494%2013.4337C30.0237%2013.44%2030.2994%2013.4357%2030.5777%2013.4274C31.0811%2013.421%2031.5579%2013.4197%2032.0318%2013.4914C34.9664%2013.7352%2037.7144%2014.6085%2040.2052%2016.0868C42.3489%2017.3655%2044.2716%2019.1525%2045.7607%2021.264C47.0255%2023.0628%2047.9756%2025.0528%2048.4928%2027.0393C48.572%2027.3176%2048.6299%2027.5931%2048.6839%2027.8659C48.7154%2028.0428%2048.7563%2028.2145%2048.7892%2028.3636C48.8037%2028.4541%2048.8208%2028.5406%2048.8445%2028.6258C48.8749%2028.7443%2048.8986%2028.864%2048.9116%2028.9651L48.9793%2029.6047C48.9922%2029.7748%2049.0132%2029.9331%2049.0301%2030.0887C49.0668%2030.3268%2049.0889%2030.5608%2049.0964%2030.7561L49.1083%2031.9001C49.1312%2032.3307%2049.089%2032.7116%2049.0522%2033.0673C49.0384%2033.2598%2049.0126%2033.4443%2049.0123%2033.5824C48.9961%2033.6926%2048.9918%2033.7935%2048.9836%2033.8917C48.9753%2034.0072%2048.9724%2034.1148%2048.9414%2034.2554L48.5449%2036.3059C48.3134%2037.8623%2049.3793%2039.3365%2050.9488%2039.5822C52.0417%2039.7601%2053.1536%2039.2819%2053.7711%2038.3664C54.0063%2038.0176%2054.1604%2037.6257%2054.2227%2037.2064L54.5217%2035.2574C54.5514%2035.0756%2054.572%2034.83%2054.5846%2034.5791L54.6028%2034.2338C54.6098%2034.0598%2054.6223%2033.8779%2054.6347%2033.6788C54.6734%2033.1052%2054.7163%2032.4479%2054.6619%2031.8058L54.5867%2030.4289C54.5622%2030.0952%2054.5097%2029.76%2054.4559%2029.4181C54.431%2029.2572%2054.4048%2029.0896%2054.3826%2028.9074L54.2687%2028.104C54.2332%2027.9244%2054.1804%2027.7273%2054.1329%2027.5396L54.0643%2027.2454C54.0195%2027.071%2053.9773%2026.8927%2053.9338%2026.7076C53.8455%2026.3309%2053.7479%2025.9422%2053.613%2025.5571C52.84%2023.0292%2051.5383%2020.5194%2049.8338%2018.2799C47.8544%2015.682%2045.3333%2013.5087%2042.5563%2011.9816Z'%20fill='%234945FF'/%3e%3c/svg%3e",L7=h.forwardRef(({children:e,small:n=!1,...a},c)=>s.jsxs("div",{role:"alert","aria-live":"assertive",ref:c,...a,children:[s.jsx(sr,{children:e}),s.jsx(B7,{src:E7,"aria-hidden":!0,$small:n})]})),V7=it`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(359deg);
  }
`,B7=I.img`
  animation: ${V7} 1s infinite linear;
  will-change: transform;
  ${({$small:e,theme:n})=>e&&`width: ${n.spaces[6]}; height: ${n.spaces[6]};`}
`,D7=h.forwardRef(({allowCustomValue:e,autocomplete:n,children:a,className:c,clearLabel:o="clear",creatable:l=!1,createMessage:u=he=>`Create "${he}"`,defaultFilterValue:m,defaultTextValue:v,defaultOpen:R=!1,open:C,onOpenChange:y,disabled:b=!1,hasError:A,id:T,filterValue:M,hasMoreItems:V=!1,isPrintableCharacter:L,loading:_=!1,loadingMessage:D="Loading content...",name:N,noOptionsMessage:z=()=>"No results found",onChange:X,onClear:q,onCreateOption:de,onFilterValueChange:ie,onInputChange:se,onTextValueChange:$e,onLoadMore:ne,placeholder:P="Select or enter a value",required:ee=!1,size:_e="M",startIcon:je,textValue:we,value:ye,...Me},Be)=>{const[he,Je]=Kt({prop:C,defaultProp:R,onChange:y}),[me,ze]=Kt({prop:we,defaultProp:e&&!v?ye:v,onChange:$e}),[Ne,Ye]=Kt({prop:M,defaultProp:m,onChange:ie}),K=h.useRef(null),xe=h.useRef(null),Se=xt(xe,Be),oe=h.useRef(null),ge=Ge=>{q&&!b&&(ze(""),Ye(""),q(Ge),xe.current.focus())},Ce=Ge=>{Je(Ge)},rt=Ge=>{ze(Ge)},Ee=Ge=>{Ye(Ge)},Ae=Ge=>{se&&se(Ge)},_t=Ge=>{X&&X(Ge)},Ze=Ge=>{ne&&V&&!_&&ne(Ge)},lr=()=>{de&&me&&de(me)},Uo=Wt(),ln=`intersection-${rr(Uo)}`;Or(K,Ze,{selectorToWatch:`#${ln}`,skipWhen:!he});const{error:ct,...kt}=vt("Combobox"),Hn=!!ct||A,ur=kt.id??T,$n=kt.name??N,qo=kt.required||ee;let Zt;return ct?Zt=`${ur}-error`:kt.hint&&(Zt=`${ur}-hint`),s.jsxs(Ft.Root,{autocomplete:n||(l?"list":"both"),onOpenChange:Ce,open:he,onTextValueChange:rt,textValue:me,allowCustomValue:l||e,disabled:b,required:qo,value:ye,onValueChange:_t,filterValue:Ne,onFilterValueChange:Ee,isPrintableCharacter:L,children:[s.jsxs(H7,{$hasError:Hn,$size:_e,className:c,children:[s.jsxs(G,{flex:"1",tag:"span",gap:3,children:[je?s.jsx(G,{flex:"0 0 1.6rem",tag:"span","aria-hidden":!0,children:je}):null,s.jsx(N7,{placeholder:P,id:ur,"aria-invalid":!!ct,onChange:Ae,ref:Se,name:$n,"aria-describedby":Zt,...Me})]}),s.jsxs(G,{tag:"span",gap:3,children:[me&&q?s.jsx(O7,{tag:"button",hasRadius:!0,background:"transparent",type:"button",padding:0,color:"neutral600",borderStyle:"none",onClick:ge,"aria-disabled":b,"aria-label":o,title:o,ref:oe,children:s.jsx(On,{})}):null,s.jsx(F7,{children:s.jsx(Vn,{fill:"neutral500"})})]})]}),s.jsx(Ft.Portal,{children:s.jsx(z7,{sideOffset:4,children:s.jsxs(W7,{ref:K,children:[a,l?s.jsx(Ft.CreateItem,{onPointerUp:lr,onClick:lr,asChild:!0,children:s.jsx(Ea,{children:s.jsx(le,{children:u(me??"")})})}):null,!l&&!_?s.jsx(Ft.NoValueFound,{asChild:!0,children:s.jsx(Ea,{$hasHover:!1,children:s.jsx(le,{children:z(me??"")})})}):null,_?s.jsx(G,{justifyContent:"center",alignItems:"center",paddingTop:2,paddingBottom:2,children:s.jsx(L7,{small:!0,children:D})}):null,s.jsx(Z,{id:ln,width:"100%",height:"1px"})]})})})]})}),O7=I(Z)`
  padding: 0;
`,H7=I(Ft.Trigger)`
  position: relative;
  border: 1px solid ${({theme:e,$hasError:n})=>n?e.colors.danger600:e.colors.neutral200};
  border-radius: ${({theme:e})=>e.borderRadius};
  background: ${({theme:e})=>e.colors.neutral0};
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({theme:e})=>e.spaces[4]};

  ${e=>{switch(e.$size){case"S":return te`
          padding-inline-start: ${({theme:n})=>n.spaces[4]};
          padding-inline-end: ${({theme:n})=>n.spaces[3]};
          padding-block: ${({theme:n})=>n.spaces[1]};
        `;default:return te`
          padding-inline-start: ${({theme:n})=>n.spaces[4]};
          padding-inline-end: ${({theme:n})=>n.spaces[3]};
          padding-block: ${({theme:n})=>n.spaces[2]};
        `}}}

  &[data-disabled] {
    color: ${({theme:e})=>e.colors.neutral600};
    background: ${({theme:e})=>e.colors.neutral150};
    cursor: not-allowed;
  }

  /* Required to ensure the below inputFocusStyles are adhered too */
  &:focus-visible {
    outline: none;
  }

  ${({theme:e,$hasError:n})=>bn()({theme:e,$hasError:n})};
`,N7=I(Ft.TextInput)`
  width: 100%;
  font-size: 1.4rem;
  line-height: 2.2rem;
  color: ${({theme:e})=>e.colors.neutral800};
  padding: 0;
  border: none;
  background-color: transparent;

  &:focus-visible {
    outline: none;
  }

  &[aria-disabled='true'] {
    cursor: inherit;
  }
`,F7=I(Ft.Icon)`
  border: none;
  background: transparent;
  padding: 0;
  color: ${({theme:e})=>e.colors.neutral600};
  display: flex;

  &[aria-disabled='true'] {
    cursor: inherit;
  }
`,z7=I(Ft.Content)`
  background: ${({theme:e})=>e.colors.neutral0};
  box-shadow: ${({theme:e})=>e.shadows.filterShadow};
  border: 1px solid ${({theme:e})=>e.colors.neutral150};
  border-radius: ${({theme:e})=>e.borderRadius};
  width: var(--radix-combobox-trigger-width);
  /* This is from the design-system figma file. */
  max-height: 15rem;
  z-index: ${({theme:e})=>e.zIndices.popover};

  @media (prefers-reduced-motion: no-preference) {
    animation-duration: ${e=>e.theme.motion.timings[200]};

    /* The select can't animate out yet, watch https://github.com/radix-ui/primitives/issues/1893, or take a look and solve it yourself. */
    &[data-state='open'] {
      animation-timing-function: ${e=>e.theme.motion.easings.authenticMotion};

      &[data-side='top'] {
        animation-name: ${qe.slideUpIn};
      }

      &[data-side='bottom'] {
        animation-name: ${qe.slideDownIn};
      }
    }
  }
`,W7=I(Ft.Viewport)`
  padding: ${({theme:e})=>e.spaces[1]};
`,k7=h.forwardRef(({children:e,value:n,disabled:a,textValue:c,...o},l)=>s.jsx(Ft.ComboboxItem,{asChild:!0,value:n,disabled:a,textValue:c,children:s.jsx(Ea,{ref:l,...o,children:s.jsx(Ft.ItemText,{asChild:!0,children:s.jsx(le,{children:e})})})})),Ea=I.div`
  width: 100%;
  border: none;
  text-align: left;
  outline-offset: -3px;
  padding: ${({theme:e})=>e.spaces[2]} ${({theme:e})=>e.spaces[4]};
  background-color: ${({theme:e})=>e.colors.neutral0};
  border-radius: ${({theme:e})=>e.borderRadius};
  user-select: none;

  &[data-state='checked'] {
    background-color: ${({theme:e})=>e.colors.primary100};
    color: ${({theme:e})=>e.colors.primary600};
    font-weight: bold;
  }

  &:hover,
  &[data-highlighted] {
    outline: none;
    background-color: ${({theme:e,$hasHover:n=!0})=>n?e.colors.primary100:e.colors.neutral0};
  }

  &[data-highlighted] {
    color: ${({theme:e})=>e.colors.primary600};
    font-weight: bold;
  }
`,U7=Y3,q7=h.forwardRef((e,n)=>s.jsx(P3,{...e,asChild:!0,ref:n})),G7=h.forwardRef((e,n)=>s.jsxs(n6,{children:[s.jsx(K7,{}),s.jsx(Y7,{ref:n,...e})]})),K7=I(s6)`
  background-color: ${e=>e.theme.colors.neutral800};
  position: fixed;
  inset: 0;
  z-index: ${e=>e.theme.zIndices.overlay};
  opacity: 0.2;

  @media (prefers-reduced-motion: no-preference) {
    animation: ${qe.overlayFadeIn} ${e=>e.theme.motion.timings[200]}
      ${e=>e.theme.motion.easings.authenticMotion};
  }
`,Y7=I(c6)`
  max-width: 42rem;
  height: min-content;
  width: 100%;
  overflow: hidden;
  margin: 0 auto;
  display: flex;
  flex-direction: column;

  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  border-radius: ${e=>e.theme.borderRadius};
  background-color: ${e=>e.theme.colors.neutral0};
  box-shadow: ${e=>e.theme.shadows.popupShadow};
  z-index: ${e=>e.theme.zIndices.modal};

  @media (prefers-reduced-motion: no-preference) {
    &[data-state='open'] {
      animation-duration: ${e=>e.theme.motion.timings[200]};
      animation-timing-function: ${e=>e.theme.motion.easings.authenticMotion};
      animation-name: ${qe.modalPopIn};
    }

    &[data-state='closed'] {
      animation-duration: ${e=>e.theme.motion.timings[120]};
      animation-timing-function: ${e=>e.theme.motion.easings.easeOutQuad};
      animation-name: ${qe.modalPopOut};
    }
  }
`,Z7=h.forwardRef(({children:e,...n},a)=>s.jsx(e6,{asChild:!0,children:s.jsx(X7,{tag:"h2",variant:"beta",ref:a,padding:6,fontWeight:"bold",...n,children:e})})),X7=I(le)`
  display: flex;
  justify-content: center;
  border-bottom: solid 1px ${e=>e.theme.colors.neutral150};
`,Q7=h.forwardRef(({children:e,icon:n,...a},c)=>s.jsx(G,{ref:c,gap:2,direction:"column",paddingTop:8,paddingBottom:8,paddingLeft:6,paddingRight:6,...a,children:typeof e=="string"?s.jsxs(s.Fragment,{children:[n?h.cloneElement(n,{width:24,height:24}):null,s.jsx(Nl,{children:e})]}):e})),Nl=h.forwardRef((e,n)=>s.jsx(t6,{asChild:!0,children:s.jsx(le,{ref:n,variant:"omega",...e,tag:"p"})})),J7=h.forwardRef((e,n)=>s.jsx(P7,{ref:n,gap:2,padding:4,justifyContent:"space-between",...e,tag:"footer"})),P7=I(G)`
  border-top: solid 1px ${e=>e.theme.colors.neutral150};
  flex: 1;
`,e8=h.forwardRef((e,n)=>s.jsx(r6,{...e,asChild:!0,ref:n})),t8=h.forwardRef((e,n)=>s.jsx(o6,{...e,asChild:!0,ref:n})),Bb=Object.freeze(Object.defineProperty({__proto__:null,Action:t8,Body:Q7,Cancel:e8,Content:G7,Description:Nl,Footer:J7,Header:Z7,Root:U7,Trigger:q7},Symbol.toStringTag,{value:"Module"}));let wa=0;function n8(){h.useEffect(()=>{var e,n;const a=document.querySelectorAll("[data-radix-focus-guard]");return document.body.insertAdjacentElement("afterbegin",(e=a[0])!==null&&e!==void 0?e:rc()),document.body.insertAdjacentElement("beforeend",(n=a[1])!==null&&n!==void 0?n:rc()),wa++,()=>{wa===1&&document.querySelectorAll("[data-radix-focus-guard]").forEach(c=>c.remove()),wa--}},[])}function rc(){const e=document.createElement("span");return e.setAttribute("data-radix-focus-guard",""),e.tabIndex=0,e.style.cssText="outline: none; opacity: 0; position: fixed; pointer-events: none",e}function sn(e,n){const a=h.useRef(null);return n&&a.current&&r8(n,a.current)&&(n=a.current),a.current=n??null,h.useMemo(()=>new u4(e,n),[e,n])}function r8(e,n){if(e===n)return!0;const a=Object.keys(e),c=Object.keys(n);if(a.length!==c.length)return!1;for(const o of a)if(n[o]!==e[o])return!1;return!0}const gi={Log:"live-region-log",Status:"live-region-status",Alert:"live-region-alert"},oc=e=>{const n=document.querySelector(`#${gi.Log}`);n&&(n.innerText=e)},ac=e=>{const n=document.querySelector(`#${gi.Status}`);n&&(n.innerText=e)},ic=e=>{const n=document.querySelector(`#${gi.Alert}`);n&&(n.innerText=e)},Db=()=>(h.useEffect(()=>()=>{oc(""),ic(""),ac("")},[]),{notifyLog:oc,notifyAlert:ic,notifyStatus:ac});T6`
${te`
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  * {
    margin: 0;
  }

  html {
    /* Sets 1rem === 10px */
    font-size: 62.5%;
  }

  body {
    height: 100%;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans',
      'Helvetica Neue', sans-serif;
    color: ${({theme:e})=>e.colors.neutral800};
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
  }

  img,
  picture,
  video,
  canvas {
    display: block;
    max-width: 100%;
  }

  input,
  button,
  textarea,
  select {
    padding: 0;
    font: inherit;
  }

  button {
    border: unset;
    background: unset;
    padding: unset;
    margin: unset;
  }

  p,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    overflow-wrap: break-word;
    font: unset;
  }

  #root {
    isolation: isolate;
  }

  ol,
  ul {
    list-style: none;
    padding: unset;
    margin: unset;
  }

  table {
    border-collapse: collapse;
    border-spacing: 0;
  }

  *:focus-visible {
    outline: 2px solid ${({theme:e})=>e.colors.primary600};
    outline-offset: 2px;
  }

  /* Focusing the button with a mouse, touch, or stylus will show a subtle drop shadow. */
  *:focus:not(:focus-visible) {
    outline: none;
  }

  .lock-body-scroll {
    height: 100vh;
    overflow-y: hidden;
  }
`}
`;const sc="en-EN",o8=()=>typeof navigator>"u"?sc:navigator.language?navigator.language:sc,[Ob,ko]=Br("StrapiDesignSystem",{locale:o8()}),a8=D6,Fl=h.forwardRef(({container:e=globalThis?.document?.body,...n},a)=>e?ar.createPortal(s.jsx(Z,{ref:a,...n}),e):null);Fl.displayName="Portal";const i8=h.forwardRef(({onClear:e,clearLabel:n="Clear",startIcon:a,disabled:c,hasError:o,children:l,id:u,size:m="M",withTags:v,...R},C)=>{const y=h.useRef(null),b=M=>{e&&!c&&(e(M),y.current.focus())},{labelNode:A}=vt("SelectTrigger"),T=xt(y,C);return s.jsx(zt.Trigger,{asChild:!0,children:s.jsxs(c8,{"aria-disabled":c,$hasError:o,ref:T,alignItems:"center",justifyContent:"space-between",position:"relative",overflow:"hidden",hasRadius:!0,background:c?"neutral150":"neutral0",gap:4,cursor:"default","aria-labelledby":A?`${u}-label`:void 0,$size:m,$withTags:v,...R,children:[s.jsxs(G,{flex:"1",tag:"span",gap:3,children:[a&&s.jsx(G,{tag:"span","aria-hidden":!0,children:a}),l]}),s.jsxs(G,{tag:"span",gap:3,children:[e?s.jsx(s8,{tag:"button",hasRadius:!0,background:"transparent",role:"button",tabIndex:0,onClick:b,"aria-disabled":c,"aria-label":n,title:n,cursor:"pointer",children:s.jsx(On,{})}):null,s.jsx(l8,{children:s.jsx(Vn,{})})]})]})})}),s8=I(Z)`
  border: none;
  display: flex;

  svg {
    height: 1.1rem;
    width: 1.1rem;
  }

  svg path {
    fill: ${({theme:e})=>e.colors.neutral500};
  }
`,c8=I(G)`
  border: 1px solid ${({theme:e,$hasError:n})=>n?e.colors.danger600:e.colors.neutral200};
  ${e=>{switch(e.$size){case"S":return te`
          padding-block: ${e.theme.spaces[1]};
          padding-inline-start: ${e.$withTags?e.theme.spaces[1]:e.theme.spaces[4]};
          padding-inline-end: ${e.theme.spaces[3]};
        `;default:return te`
          padding-block: ${e.$withTags?"0.3rem":e.theme.spaces[2]};
          padding-inline-start: ${e.$withTags?e.theme.spaces[1]:e.theme.spaces[4]};
          padding-inline-end: ${e.theme.spaces[3]};
        `}}}

  &[aria-disabled='true'] {
    color: ${e=>e.theme.colors.neutral500};
  }

  /* Required to ensure the below inputFocusStyles are adhered too */
  &:focus-visible {
    outline: none;
  }

  ${({theme:e,$hasError:n})=>bn()({theme:e,$hasError:n})};
`,l8=I(zt.Icon)`
  display: flex;
  & > svg {
    fill: ${({theme:e})=>e.colors.neutral500};
  }
`,u8=h.forwardRef(({children:e,placeholder:n,...a},c)=>s.jsx(d8,{ref:c,ellipsis:!0,...a,children:s.jsx(h8,{placeholder:n,children:e})})),d8=I(le)`
  flex: 1;
  font-size: 1.4rem;
  line-height: 2.2rem;
`,h8=I(zt.Value)`
  display: flex;
  gap: ${({theme:e})=>e.spaces[1]};
  flex-wrap: wrap;
`,f8=I(zt.Content)`
  background: ${({theme:e})=>e.colors.neutral0};
  box-shadow: ${({theme:e})=>e.shadows.filterShadow};
  border: 1px solid ${({theme:e})=>e.colors.neutral150};
  border-radius: ${({theme:e})=>e.borderRadius};
  min-width: var(--radix-select-trigger-width);
  max-height: 15.6rem;
  z-index: ${({theme:e})=>e.zIndices.popover};

  @media (prefers-reduced-motion: no-preference) {
    animation-duration: ${e=>e.theme.motion.timings[200]};

    /* The select can't animate out yet, watch https://github.com/radix-ui/primitives/issues/1893, or take a look and solve it yourself. */
    &[data-state='open'] {
      animation-timing-function: ${e=>e.theme.motion.easings.authenticMotion};

      &[data-side='top'] {
        animation-name: ${qe.slideUpIn};
      }

      &[data-side='bottom'] {
        animation-name: ${qe.slideDownIn};
      }
    }
  }
`,g8=I(zt.Viewport)`
  padding: ${({theme:e})=>e.spaces[1]};
`,w8=h.forwardRef((e,n)=>s.jsx(x8,{ref:n,...e})),m8=te`
  width: 100%;
  border: none;
  text-align: left;
  outline-offset: -3px;
  border-radius: ${e=>e.theme.borderRadius};
  padding: ${e=>`${e.theme.spaces[2]} ${e.theme.spaces[4]}`};
  padding-left: ${({theme:e})=>e.spaces[4]};
  background-color: ${({theme:e})=>e.colors.neutral0};
  display: flex;
  align-items: center;
  gap: ${({theme:e})=>e.spaces[2]};
  white-space: nowrap;
  user-select: none;
  color: ${({theme:e})=>e.colors.neutral800};

  &:focus-visible {
    outline: none;
    background-color: ${({theme:e})=>e.colors.primary100};
  }
`,x8=I(zt.Item)`
  ${m8}

  &:hover {
    background-color: ${({theme:e})=>e.colors.primary100};
  }

  &[data-state='checked'] {
    font-weight: bold;
    background-color: ${({theme:e})=>e.colors.primary100};
    color: ${({theme:e})=>e.colors.primary600};
    font-weight: bold;
  }
`,zl=zt.Root,Wl=i8,kl=u8,Ul=zt.Portal,ql=f8,Gl=g8,wi=w8,Kl=zt.ItemIndicator,Yl=zt.ItemText,v8=zt.Group,cc=h.forwardRef(({children:e,clearLabel:n="Clear",customizeContent:a,disabled:c,hasError:o,id:l,name:u,onChange:m,onClear:v,onCloseAutoFocus:R,onReachEnd:C,placeholder:y,required:b,size:A,startIcon:T,value:M,...V},L)=>{const[_,D]=h.useState(),[N,z]=h.useState(!1),X=he=>{z(he)},q=he=>{v&&v(he),m||D("")},de=he=>{m?m(typeof M=="number"?Number(he):he):D(he)},ie=h.useRef(null),se=Wt(),$e=`intersection-${rr(se)}`;Or(ie,he=>{C&&C(he)},{selectorToWatch:`#${$e}`,skipWhen:!N});const{error:P,required:ee,..._e}=vt("SingleSelect"),je=!!P||o,we=_e.id??l,ye=_e.name??u;let Me;P?Me=`${we}-error`:_e.hint&&(Me=`${we}-hint`);const Be=(typeof M<"u"&&M!==null?M.toString():_)??"";return s.jsxs(zl,{onOpenChange:X,disabled:c,required:ee??b,onValueChange:de,value:Be,...V,children:[s.jsx(Wl,{ref:L,id:we,name:ye,startIcon:T,hasError:je,disabled:c,clearLabel:n,onClear:Be&&v?q:void 0,"aria-label":V["aria-label"],"aria-describedby":Me??V["aria-describedby"],size:A,children:s.jsx(kl,{placeholder:y,textColor:Be?"neutral800":"neutral600",children:Be&&a?a(Be):void 0})}),s.jsx(Ul,{children:s.jsx(ql,{position:"popper",sideOffset:4,onCloseAutoFocus:R,children:s.jsxs(Gl,{ref:ie,children:[e,s.jsx(Z,{id:$e,width:"100%",height:"1px"})]})})})]})}),lc=h.forwardRef(({value:e,startIcon:n,children:a,...c},o)=>s.jsxs(wi,{ref:o,value:e.toString(),...c,children:[n&&s.jsx(G,{tag:"span","aria-hidden":!0,children:n}),s.jsx(le,{lineHeight:"20px",width:"100%",children:s.jsx(Yl,{children:a})})]})),p8=200,uc=15,[b8,cr]=Br("DatePicker"),$8=h.forwardRef(({calendarLabel:e,className:n,initialDate:a,locale:c,maxDate:o,minDate:l,monthSelectLabel:u="Month",onChange:m,value:v,yearSelectLabel:R="Year",hasError:C,id:y,name:b,disabled:A=!1,required:T=!1,onClear:M,clearLabel:V="Clear",size:L="M",..._},D)=>{const N=pa(),z=ko("DatePicker"),X=c??z.locale,q=sn(X,{day:"2-digit",month:"2-digit",year:"numeric"}),[de,ie]=h.useState(!1),[se,$e]=h.useState(null),[ne,P]=h.useState(null),[ee,_e]=h.useState(null),[je,we]=h.useState(),[ye,Me]=Kt({defaultProp:a?Mn(a):void 0,prop:v?Mn(v):void 0,onChange(Ae){m&&m(Ae?.toDate(N))}}),[Be,he]=h.useMemo(()=>{const Ae=a?Mn(a):Da("UTC"),_t=l?Mn(l):Ae.set({day:1,month:1,year:Ae.year-p8});let Ze=o?Mn(o):Ae.set({day:31,month:12,year:Ae.year+uc});return Ze.compare(_t)<0&&(Ze=_t.set({day:31,month:12,year:_t.year+uc})),[_t,Ze]},[l,o,a]),[Je,me]=h.useState(C8({currentValue:ye,minDate:Be,maxDate:he})),ze=Wt(),Ne=h.useRef(null),Ye=Ae=>{M&&!A&&(we(""),Me(void 0),M(Ae),ne?.focus())},K=h.useCallback(Ae=>{Ae&&ye&&me(ye),ie(Ae)},[ye]);or(()=>{if(v){const Ae=Mn(v);we(q.format(Ae.toDate(N))),me(Ae)}else we("")},[v,q,N]),or(()=>{if(a&&je===void 0){const Ae=Mn(a);we(q.format(Ae.toDate(N)))}},[a,je,q,N]);const{error:xe,...Se}=vt("Combobox"),oe=!!xe||C,ge=Se.id??y,Ce=Se.name??b,rt=Se.required||T;let Ee;return xe?Ee=`${ge}-error`:Se.hint&&(Ee=`${ge}-hint`),s.jsxs(b8,{calendarDate:Je,content:ee,contentId:ze,disabled:A,locale:X,minDate:Be,maxDate:he,open:de,onCalendarDateChange:me,onContentChange:_e,onOpenChange:K,onTextInputChange:P,onTextValueChange:we,onTriggerChange:$e,onValueChange:Me,required:rt,textInput:ne,textValue:je,timeZone:N,trigger:se,value:ye,children:[s.jsxs(S8,{className:n,hasError:oe,size:L,children:[s.jsx(Fw,{fill:"neutral500","aria-hidden":!0}),s.jsx(A8,{ref:D,"aria-describedby":Ee,id:ge,name:Ce,..._}),je&&M?s.jsx(_8,{tag:"button",hasRadius:!0,background:"transparent",type:"button",onClick:Ye,"aria-disabled":A,"aria-label":V,title:V,ref:Ne,children:s.jsx(On,{})}):null]}),s.jsx(Fl,{children:s.jsx(E8,{label:e,children:s.jsx(O8,{monthSelectLabel:u,yearSelectLabel:R})})})]})}),dc=e=>!!e.match(/^[^a-zA-Z]*$/),C8=({currentValue:e,minDate:n,maxDate:a})=>{const c=Da("UTC");return e||(ba(n,c)===n&&$a(a,c)===a?c:ba(n,c)===c?n:$a(a,c)===c?a:c)},y8="DatePickerTrigger",S8=h.forwardRef(({hasError:e,size:n,...a},c)=>{const o=cr(y8),l=xt(c,m=>o.onTriggerChange(m)),u=()=>{o.disabled||o.onOpenChange(!0)};return s.jsx(Va,{asChild:!0,trapped:o.open,onMountAutoFocus:m=>{m.preventDefault()},onUnmountAutoFocus:m=>{document.getSelection()?.empty(),m.preventDefault()},children:s.jsx(R8,{ref:l,$hasError:e,$size:n,...a,hasRadius:!0,gap:3,overflow:"hidden",background:o.disabled?"neutral150":"neutral0",onClick:En(a.onClick,()=>{o.textInput?.focus()}),onPointerDown:En(a.onPointerDown,m=>{const v=m.target;v.hasPointerCapture(m.pointerId)&&v.releasePointerCapture(m.pointerId),(v.closest("button")??v.closest("div"))===m.currentTarget&&m.button===0&&m.ctrlKey===!1&&(u(),o.textInput?.focus())})})})}),R8=I(G)`
  border: 1px solid ${({theme:e,$hasError:n})=>n?e.colors.danger600:e.colors.neutral200};
  ${e=>{switch(e.$size){case"S":return te`
          padding-block: ${e.theme.spaces[1]};
          padding-inline: ${e.theme.spaces[3]};
        `;default:return te`
          padding-block: ${e.theme.spaces[2]};
          padding-inline: ${e.theme.spaces[3]};
        `}}}

  & > svg {
    flex: 1 0 auto;
  }

  &[data-disabled] {
    color: ${({theme:e})=>e.colors.neutral600};
    background: ${({theme:e})=>e.colors.neutral150};
    cursor: not-allowed;
  }

  /* Required to ensure the below inputFocusStyles are adhered too */
  &:focus-visible {
    outline: none;
  }

  ${({theme:e,$hasError:n})=>bn()({theme:e,$hasError:n})};
`,_8=I(Z)`
  border: none;
  color: ${({theme:e})=>e.colors.neutral600};
  padding: 0;
  cursor: pointer;
`,j8="DatePickerTextInput",A8=h.forwardRef(({placeholder:e,...n},a)=>{const c=cr(j8),{onTextValueChange:o,textValue:l,onTextInputChange:u,onOpenChange:m,disabled:v,locale:R}=c,C=xt(a,L=>u(L)),y=()=>{v||m(!0)},b=sn(R,{year:"numeric",month:"2-digit",day:"2-digit"}),[A,T,M]=h.useMemo(()=>{const L=b.formatToParts(new Date),_=L.filter(z=>z.type==="year"||z.type==="month"||z.type==="day"),D=_.map(z=>{switch(z.type){case"day":return"DD";case"month":return"MM";case"year":return"YYYY";default:return""}}),N=L.find(z=>z.type==="literal")?.value??"";return[D,N,_]},[b]),V=A.map(L=>`\\d{${L.length}}`).join(`\\${T}`);return s.jsx(T8,{role:"combobox",type:"text",inputMode:"numeric",ref:C,"aria-autocomplete":"none","aria-controls":c.contentId,"aria-disabled":c.disabled,"aria-expanded":c.open,"aria-required":c.required,"aria-haspopup":"dialog","data-state":c.open?"open":"closed",disabled:v,"data-disabled":v?"":void 0,pattern:V,placeholder:e??A.join(T),...n,value:l??"",onBlur:En(n.onBlur,()=>{if(!c.textValue){c.onValueChange(void 0);return}c.onTextValueChange(b.format(c.calendarDate.toDate(c.timeZone))),c.onValueChange(c.calendarDate)}),onChange:En(n.onChange,L=>{if(dc(L.target.value)){const _=L.target.value.split(T),[D,N,z]=M.map((P,ee)=>{const _e=_[ee];return{...P,value:_e}}).sort((P,ee)=>P.type==="year"?1:ee.type==="year"?-1:P.type==="month"?1:ee.type==="month"?-1:0).map(P=>P.value),X=c.calendarDate.year;let q=c.calendarDate.year;if(z){const P=z.length===1?`0${z}`:z;q=z.length<3?Number(`${X}`.slice(0,4-P.length)+P):Number(P)}z&&z.length<3&&q>c.maxDate.year&&(q-=100);const de=c.calendarDate.set({year:q}),ie=de.calendar.getMonthsInYear(de),se=de.set({month:N&&Number(N)<=ie?Number(N):void 0}),$e=se.calendar.getDaysInMonth(se),ne=se.set({day:D&&Number(D)<=$e?Number(D):void 0});c.onCalendarDateChange(I8(ne,c.minDate,c.maxDate)),c.onTextValueChange(L.target.value)}}),onKeyDown:En(n.onKeyDown,L=>{if(!c.open&&(dc(L.key)||["ArrowDown","Backspace"].includes(L.key)))y();else if(["Tab"].includes(L.key)&&c.open)L.preventDefault();else if(["Escape"].includes(L.key))c.open?c.onOpenChange(!1):(c.onValueChange(void 0),c.onTextValueChange("")),L.preventDefault();else if(c.open&&["ArrowDown","ArrowUp","ArrowLeft","ArrowRight"].includes(L.key))switch(L.preventDefault(),L.key){case"ArrowDown":{const _=c.calendarDate.add({weeks:1});if(c.maxDate&&_.compare(c.maxDate)>0)return;c.onCalendarDateChange(_);return}case"ArrowRight":{const _=c.calendarDate.add({days:1});if(c.maxDate&&_.compare(c.maxDate)>0)return;c.onCalendarDateChange(_);return}case"ArrowUp":{const _=c.calendarDate.subtract({weeks:1});if(c.minDate&&_.compare(c.minDate)<0)return;c.onCalendarDateChange(_);return}case"ArrowLeft":{const _=c.calendarDate.subtract({days:1});if(c.minDate&&_.compare(c.minDate)<0)return;c.onCalendarDateChange(_)}}else c.open&&["Enter"].includes(L.key)&&(L.preventDefault(),o(b.format(c.calendarDate.toDate(c.timeZone))),c.onValueChange(c.calendarDate),c.onOpenChange(!1))})})});function I8(e,n,a){return n&&(e=$a(e,n)),a&&(e=ba(e,a)),e}const T8=I.input`
  width: 100%;
  font-size: 1.4rem;
  line-height: 2.2rem;
  color: ${({theme:e})=>e.colors.neutral800};
  border: none;
  background-color: transparent;

  &:focus-visible {
    outline: none;
  }

  &[aria-disabled='true'] {
    cursor: inherit;
  }
`,M8="DatePickerContent",E8=h.forwardRef((e,n)=>{const[a,c]=h.useState(),o=cr(M8);if(or(()=>{c(new DocumentFragment)},[]),!o.open){const l=a;return l?ar.createPortal(s.jsx("div",{children:e.children}),l):null}return s.jsx(V8,{...e,ref:n})}),L8="DatePickerContent",V8=h.forwardRef((e,n)=>{const{label:a="Choose date",...c}=e,{onOpenChange:o,...l}=cr(L8),{x:u,y:m,refs:v,strategy:R,placement:C}=M6({strategy:"fixed",placement:"bottom-start",middleware:[E6({mainAxis:4}),L6(),V6()],elements:{reference:l.trigger},whileElementsMounted:B6});h.useEffect(()=>{const b=()=>{o(!1)};return window.addEventListener("blur",b),window.addEventListener("resize",b),()=>{window.removeEventListener("blur",b),window.removeEventListener("resize",b)}},[o]);const y=xt(n,b=>l.onContentChange(b),v.setFloating);return n8(),s.jsx(Ba,{allowPinchZoom:!0,children:s.jsx(a8,{asChild:!0,onFocusOutside:b=>{b.preventDefault()},onDismiss:()=>{o(!1)},children:s.jsx(B8,{ref:y,"data-state":l.open?"open":"closed","data-side":C.includes("top")?"top":"bottom",onContextMenu:b=>b.preventDefault(),id:l.contentId,role:"dialog","aria-modal":"true","aria-label":a,style:{left:u,top:m,position:R},hasRadius:!0,background:"neutral0",padding:1,...c})})})}),B8=I(Z)`
  box-shadow: ${({theme:e})=>e.shadows.filterShadow};
  z-index: ${({theme:e})=>e.zIndices.popover};
  border: 1px solid ${({theme:e})=>e.colors.neutral150};

  @media (prefers-reduced-motion: no-preference) {
    animation-duration: ${e=>e.theme.motion.timings[200]};

    &[data-state='open'] {
      animation-timing-function: ${e=>e.theme.motion.easings.authenticMotion};

      &[data-side='top'] {
        animation-name: ${qe.slideUpIn};
      }

      &[data-side='bottom'] {
        animation-name: ${qe.slideDownIn};
      }
    }
  }
`,D8="DatePickerCalendar",O8=h.forwardRef(({monthSelectLabel:e,yearSelectLabel:n,...a},c)=>{const{locale:o,timeZone:l,minDate:u,maxDate:m,calendarDate:v,onCalendarDateChange:R}=cr(D8),C=O6(v),y=h.useMemo(()=>{const D=u.year,N=m.year;return[...Array(N-D+1).keys()].map(z=>(D+z).toString())},[u,m]),b=sn(o,{month:"long"}),A=h.useMemo(()=>[...Array(v.calendar.getMonthsInYear(v)).keys()].map(D=>b.format(v.set({month:D+1}).toDate(l))),[v,b,l]),T=sn(o,{weekday:"short"}),M=h.useMemo(()=>{const D=Tc(Da(l),o);return[...new Array(7).keys()].map(N=>{const X=D.add({days:N}).toDate(l);return T.format(X)})},[l,o,T]),V=D=>{if(typeof D=="number")return;const N=v.set({month:A.indexOf(D)+1});R(N)},L=D=>{if(typeof D=="number")return;const N=v.set({year:parseInt(D,10)});R(N)},_=H8(C,o);return s.jsxs(G,{ref:c,direction:"column",alignItems:"stretch",padding:4,...a,children:[s.jsxs(N8,{justifyContent:"flex-start",paddingBottom:4,paddingLeft:2,paddingRight:2,gap:2,children:[s.jsx(Bn,{children:s.jsx(cc,{"aria-label":e,value:A[v.month-1],onChange:V,children:A.map(D=>s.jsx(lc,{value:D,children:D},D))})}),s.jsx(Bn,{children:s.jsx(cc,{value:v.year.toString(),"aria-label":n,onChange:L,children:y.map(D=>s.jsx(lc,{value:D,children:D},D))})})]}),s.jsxs("table",{role:"grid",children:[s.jsx("thead",{"aria-hidden":!0,children:s.jsx("tr",{"aria-rowindex":0,children:M.map((D,N)=>s.jsx(F8,{"aria-colindex":N,children:D},D))})}),s.jsx("tbody",{children:[...new Array(6).keys()].map(D=>s.jsx("tr",{"aria-rowindex":D+2,children:_(D).map((N,z)=>N?s.jsx(k8,{"aria-colindex":z+1,date:N,startDate:C,disabled:u.compare(N)>0||N.compare(m)>0},N.toString()):s.jsx(Zl,{"aria-colindex":z+1},z+1))},D))})]})]})}),H8=(e,n)=>a=>{let c=e.add({weeks:a});const o=[];c=Tc(c,n);const l=H6(c,n);for(let u=0;u<l;u++)o.push(null);for(;o.length<7;){o.push(c);const u=c.add({days:1});if(Mc(c,u))break;c=u}for(;o.length<7;)o.push(null);return o},N8=I(G)`
  div[role='combobox'] {
    border: 1px solid transparent;
    background: transparent;
    font-weight: ${e=>e.theme.fontWeights.bold};

    svg {
      fill: ${({theme:e})=>e.colors.neutral500};
    }

    &:hover {
      background-color: ${({theme:e})=>e.colors.neutral100};
    }
  }
`,F8=h.forwardRef(({children:e,...n},a)=>s.jsx(z8,{tag:"th",role:"gridcell",ref:a,...n,height:"2.4rem",width:"3.2rem",children:s.jsx(le,{variant:"pi",fontWeight:"bold",color:"neutral800",children:e.slice(0,2)})})),z8=I(Z)`
  border-radius: ${({theme:e})=>e.borderRadius};
  text-transform: capitalize;
`,W8="DatePickerCalendarCell",k8=h.forwardRef(({date:e,startDate:n,disabled:a,...c},o)=>{const{timeZone:l,locale:u,calendarDate:m,onValueChange:v,onOpenChange:R,onTextValueChange:C,onCalendarDateChange:y}=cr(W8),b=Mc(m,e),A=sn(u,{weekday:"long",day:"numeric",month:"long",year:"numeric"}),T=h.useMemo(()=>A.format(e.toDate(l)),[A,e,l]),M=sn(u,{day:"numeric",calendar:e.calendar.identifier}),V=h.useMemo(()=>M.formatToParts(e.toDate(l)).find(z=>z.type==="day").value,[M,e,l]),L=sn(u,{day:"2-digit",month:"2-digit",year:"numeric"}),_=N6(n),D=e.compare(n)<0||e.compare(_)>0;let N="neutral900";return b?N="primary600":D&&(N="neutral600"),s.jsx(Zl,{tag:"td",role:"gridcell",ref:o,"aria-selected":b,...c,hasRadius:!0,"aria-label":T,tabIndex:b?0:-1,background:b?"primary100":"neutral0",cursor:"pointer",onPointerDown:En(c.onPointerDown,z=>{z.preventDefault(),y(e),v(e),C(L.format(e.toDate(l))),R(!1)}),"aria-disabled":a,children:s.jsx(le,{variant:"pi",textColor:N,children:V})})}),Zl=I(Z)`
  text-align: center;
  padding: 0.7rem;
  // Trick to prevent the outline from overflowing because of the general outline-offset
  outline-offset: -2px !important;
  &[aria-disabled='true'] {
    pointer-events: none;
    opacity: 0.5;
  }

  &[aria-disabled='false'] {
    &:hover {
      background: ${({theme:e})=>e.colors.primary100};
      color: ${({theme:e})=>e.colors.primary600};
    }
  }
`,Mn=e=>{const n=e.toISOString(),a=F6(n,"UTC");return z6(a)},ma=e=>!!e.match(/^[^a-zA-Z]*$/),U8=h.forwardRef(({step:e=15,value:n,defaultValue:a,onChange:c,...o},l)=>{const u=ko("TimePicker"),[m,v]=h.useState(""),[R,C]=Kt({prop:n,defaultProp:a,onChange:c}),y=sn(u.locale,{hour:"2-digit",minute:"2-digit",hour12:!1}),b=h.useMemo(()=>{const _=y.formatToParts(new Date),{value:D}=_.find(N=>N.type==="literal");return D},[y]),A=h.useMemo(()=>{const _=60/e;return[...Array(24).keys()].flatMap(D=>[...Array(_).keys()].map(N=>y.format(new Date(0,0,0,D,N*e))))},[e,y]),T=_=>{(!_||ma(_))&&v(_)},M=_=>{const[D,N]=_.split(b);if(!D&&!N)return;const z=Number(D??"0"),X=Number(N??"0");if(!(z>23||X>59))return y.format(new Date(0,0,0,z,X))},V=_=>{const D=M(_.target.value);D?(v(D),C(D)):v(R)},L=_=>{if(typeof _<"u"){const D=M(_);C(D)}else C(_)};return h.useEffect(()=>{const _=typeof n>"u"?"":n;ma(_)&&v(_)},[n,v]),s.jsx(D7,{...o,ref:l,value:R,onChange:L,isPrintableCharacter:ma,allowCustomValue:!0,placeholder:`--${b}--`,autocomplete:"none",startIcon:s.jsx(lm,{fill:"neutral500"}),inputMode:"numeric",pattern:`\\d{2}\\${b}\\d{2}`,textValue:m,onTextValueChange:T,onBlur:V,children:A.map(_=>s.jsx(k7,{value:_,children:_},_))})}),q8=I($8)`
  flex: 1 1 70%;
  min-width: 120px;
`,G8=I(U8)`
  flex: 1 1 30%;
  min-width: 140px;
`,Hb=h.forwardRef(({clearLabel:e="clear",dateLabel:n="Choose date",timeLabel:a="Choose time",disabled:c=!1,hasError:o,onChange:l,onClear:u,required:m=!1,step:v,value:R,initialDate:C,size:y,...b},A)=>{const T=h.useRef(null),[M,V]=Kt({defaultProp:C?jr(C,!1):void 0,prop:R?jr(R,!1):R??void 0,onChange(P){l&&l(P?.toDate(pa()))}}),L=ko("DateTimePicker"),_=sn(L.locale,{hour:"2-digit",minute:"2-digit",hour12:!1}),D=M?_.format(M.toDate(pa())):"",N=P=>{let ee=P?jr(P):void 0;if(!(ee&&M&&ee.compare(M)===0)){if(D&&ee){const[_e,je]=D.split(":");ee=ee.set({hour:parseInt(_e,10),minute:parseInt(je,10)})}V(ee)}},z=P=>{if(!P)return;const[ee,_e]=P.split(":"),je=M?M.set({hour:parseInt(ee,10),minute:parseInt(_e,10)}):jr(new Date).set({hour:parseInt(ee,10),minute:parseInt(_e,10)});V(je)},X=P=>{V(void 0),u&&u(P)},q=()=>{const P=M?M.set({hour:0,minute:0}):jr(new Date);V(P)},de=xt(T,A),{error:ie,id:se,labelNode:$e}=vt("DateTimePicker"),ne=!!ie||o;return s.jsxs(G,{"aria-labelledby":$e?`${se}-label`:void 0,role:"group",flex:"1",gap:1,children:[s.jsx(Bn,{children:s.jsx(q8,{...b,size:y,value:M?.toDate("UTC"),onChange:N,required:m,onClear:u?X:void 0,clearLabel:`${e} date`,disabled:c,ref:de,"aria-label":n})}),s.jsx(Bn,{children:s.jsx(G8,{size:y,hasError:ne,value:D,onChange:z,onClear:u&&D!==void 0&&D!=="00:00"?q:void 0,clearLabel:`${e} time`,required:m,disabled:c,step:v,"aria-label":a})})]})}),jr=(e,n=!0)=>{const a=e.toISOString();let c=W6(a);return n&&(c=c.set({hour:0,minute:0})),k6(c)},K8=h.forwardRef((e,n)=>s.jsx(Y8,{ref:n,background:"neutral150",...e,"data-orientation":"horizontal",role:"separator",tag:"div"})),Y8=I(Z)`
  height: 1px;
  border: none;
  /* If contained in a Flex parent we want to prevent the Divider to shink */
  flex-shrink: 0;
`,Z8=I(Z)`
  svg {
    height: 8.8rem;
  }
`,Nb=h.forwardRef(({icon:e,content:n,action:a,hasRadius:c=!0,shadow:o="tableShadow"},l)=>s.jsxs(G,{ref:l,alignItems:"center",direction:"column",padding:11,background:"neutral0",hasRadius:c,shadow:o,children:[e?s.jsx(Z8,{paddingBottom:6,"aria-hidden":!0,children:e}):null,s.jsx(Z,{paddingBottom:4,children:s.jsx(le,{variant:"delta",tag:"p",textAlign:"center",textColor:"neutral600",children:n})}),a]})),Xl=Ec.define(),Ql=Ec.define(),X8=Lc.mark({attributes:{style:"background-color: yellow; color: black"}}),Q8=U6.define({create(){return Lc.none},update(e,n){return e=e.map(n.changes),n.effects.forEach(a=>{a.is(Xl)?e=e.update({add:a.value,sort:!0}):a.is(Ql)&&(e=e.update({filter:a.value}))}),e},provide:e=>q6.decorations.from(e)}),Fb=h.forwardRef(({hasError:e,required:n,id:a,value:c="",disabled:o=!1,onChange:l=()=>null,...u},m)=>{const v=h.useRef(),R=h.useRef(),C=h.useRef(),{error:y,...b}=vt("JsonInput"),A=!!y||e,T=b.id??a,M=b.required||n;let V;y?V=`${T}-error`:b.hint&&(V=`${T}-hint`);const L=ie=>{const se=R.current?.doc;if(se){const{text:$e,to:ne}=se.line(ie),P=ne-$e.trimStart().length;ne>P&&C.current?.dispatch({effects:Xl.of([X8.range(P,ne)])})}},_=()=>{const ie=R.current?.doc;if(ie){const se=ie.length||0;C.current?.dispatch({effects:Ql.of(($e,ne)=>ne<=0||$e>=se)})}},D=({state:ie,view:se})=>{C.current=se,R.current=ie,_();const ne=d4()(se);ne.length&&L(ie.doc.lineAt(ne[0].from).number)},N=(ie,se)=>{D(se),l(ie)},z=(ie,se)=>{C.current=ie,R.current=se,D({view:ie,state:se})},{setContainer:X,view:q}=G6({value:c,onCreateEditor:z,container:v.current,editable:!o,extensions:[K6(),Q8],onChange:N,theme:"dark",basicSetup:{lineNumbers:!0,bracketMatching:!0,closeBrackets:!0,indentOnInput:!0,syntaxHighlighting:!0,highlightSelectionMatches:!0,tabSize:2}}),de=xt(v,X);return h.useImperativeHandle(m,()=>({...q?.dom,focus(){q&&q.focus()},scrollIntoView(ie){q&&q.dom.scrollIntoView(ie)}}),[q]),s.jsx(J8,{ref:de,$hasError:A,alignItems:"stretch",fontSize:2,hasRadius:!0,"aria-required":M,id:T,"aria-describedby":V,...u})}),J8=I(G)`
  line-height: ${({theme:e})=>e.lineHeights[2]};

  .cm-editor {
    /** 
     * Hard coded since the color is the same between themes,
     * theme.colors.neutral800 changes between themes 
     */
    background-color: #32324d;
    width: 100%;
    outline: none;
  }

  .cm-scroller {
    border: 1px solid ${({theme:e,$hasError:n})=>n?e.colors.danger600:e.colors.neutral200};
    /* inputFocusStyle will receive hasError prop */
    ${bn()}
  }

  .cm-editor,
  .cm-scroller {
    border-radius: ${({theme:e})=>e.borderRadius};
  }

  .cm-gutters,
  .cm-activeLineGutter {
    /** 
     * Hard coded since the color is the same between themes,
     * theme.colors.neutral700 changes between themes 
     */
    background-color: #4a4a6a;
  }
`,zb=ht(({disabled:e,...n},a)=>s.jsx(Ta,{ref:a,tag:Dr,tabIndex:e?-1:void 0,disabled:e,...n})),P8=I(Z)`
  // To prevent global outline on focus visible to force an outline when Main is focused
  &:focus-visible {
    outline: none;
  }
`,Wb=({labelledBy:e="main-content-title",...n})=>s.jsx(P8,{"aria-labelledby":e,tag:"main",id:"main-content",tabIndex:-1,...n});I(Z)`
  text-decoration: none;

  &:focus {
    left: ${({theme:e})=>e.spaces[3]};
    top: ${({theme:e})=>e.spaces[3]};
  }
`;const e9=(e,n)=>`${e}${Math.floor(n*255).toString(16).padStart(2,"0")}`,Jl=h.forwardRef(({children:e,viewportRef:n,...a},c)=>s.jsxs(t9,{ref:c,...a,children:[s.jsx(n9,{ref:n,children:e}),s.jsx(hc,{orientation:"vertical",children:s.jsx(fc,{})}),s.jsx(hc,{orientation:"horizontal",children:s.jsx(fc,{})})]})),t9=I(u6)`
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
`,n9=I(d6)`
  min-width: 100%;
  padding-inline: 4px;
`,hc=I(h6)`
  display: flex;
  /* ensures no selection */
  user-select: none;
  /* disable browser handling of all panning and zooming gestures on touch devices */
  touch-action: none;

  &[data-orientation='vertical'] {
    width: 0.4rem;
  }

  &[data-orientation='horizontal'] {
    flex-direction: column;
    height: 0.4rem;
  }
`,fc=I(f6)`
  position: relative;
  flex: 1;
  background-color: ${e=>e.theme.colors.neutral150};
  border-radius: var(--scrollbar-size);

  /* increase target size for touch devices https://www.w3.org/WAI/WCAG21/Understanding/target-size.html */
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    height: 100%;
    min-width: 44px;
    min-height: 44px;
  }
`,r9=K3,o9=h.forwardRef((e,n)=>s.jsx(Z3,{...e,asChild:!0,ref:n})),a9=h.forwardRef((e,n)=>s.jsx(Q3,{children:s.jsx(i9,{children:s.jsx(s9,{ref:n,...e})})})),i9=I(a6)`
  background: ${e=>e9(e.theme.colors.neutral800,.2)};
  position: fixed;
  inset: 0;
  z-index: ${e=>e.theme.zIndices.overlay};

  @media (prefers-reduced-motion: no-preference) {
    animation: ${qe.overlayFadeIn} ${e=>e.theme.motion.timings[200]}
      ${e=>e.theme.motion.easings.authenticMotion};
  }
`,s9=I(i6)`
  max-width: 83rem;
  max-height: 90vh;
  height: auto;
  width: 60%;
  overflow: hidden;
  margin: 0 auto;
  display: flex;
  flex-direction: column;

  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  border-radius: ${e=>e.theme.borderRadius};
  background-color: ${e=>e.theme.colors.neutral0};
  box-shadow: ${e=>e.theme.shadows.popupShadow};
  z-index: ${e=>e.theme.zIndices.modal};

  @media (prefers-reduced-motion: no-preference) {
    &[data-state='open'] {
      animation-duration: ${e=>e.theme.motion.timings[200]};
      animation-timing-function: ${e=>e.theme.motion.easings.authenticMotion};
      animation-name: ${qe.modalPopIn};
    }

    &[data-state='closed'] {
      animation-duration: ${e=>e.theme.motion.timings[120]};
      animation-timing-function: ${e=>e.theme.motion.easings.easeOutQuad};
      animation-name: ${qe.modalPopOut};
    }
  }
`,Pl=h.forwardRef((e,n)=>s.jsx(J3,{...e,asChild:!0,ref:n})),c9=h.forwardRef(({children:e,closeLabel:n="Close modal",...a},c)=>s.jsxs(l9,{ref:c,padding:4,paddingLeft:5,paddingRight:5,background:"neutral100",justifyContent:"space-between",...a,tag:"header",children:[e,s.jsx(Pl,{children:s.jsx(Ma,{withTooltip:!1,label:n,children:s.jsx(On,{})})})]})),l9=I(G)`
  border-bottom: solid 1px ${e=>e.theme.colors.neutral150};
`,u9=h.forwardRef((e,n)=>s.jsx(X3,{asChild:!0,children:s.jsx(le,{tag:"h2",variant:"omega",fontWeight:"bold",ref:n,...e})})),d9=h.forwardRef(({children:e,...n},a)=>s.jsx(h9,{ref:a,...n,children:e})),h9=I(Jl)`
  padding-inline: ${e=>e.theme.spaces[8]};

  & > div {
    padding-block: ${e=>e.theme.spaces[8]};

    & > div {
      // the scroll area component applies a display: table to the child, which we don't want.
      display: block !important;
    }
  }
`,f9=h.forwardRef((e,n)=>s.jsx(g9,{ref:n,padding:4,paddingLeft:5,paddingRight:5,background:"neutral100",justifyContent:"space-between",...e,tag:"footer"})),g9=I(G)`
  border-top: solid 1px ${e=>e.theme.colors.neutral150};
  flex: 1;
`,kb=Object.freeze(Object.defineProperty({__proto__:null,Body:d9,Close:Pl,Content:a9,Footer:f9,Header:c9,Root:r9,Title:u9,Trigger:o9},Symbol.toStringTag,{value:"Module"})),w9="",Ub=h.forwardRef(({startAction:e,locale:n,onValueChange:a,value:c,step:o=1,disabled:l=!1,...u},m)=>{const v=ko("NumberInput"),R=n||v.locale,C=h.useRef(new Y6(R,{style:"decimal"})),y=h.useRef(new Z6(R,{maximumFractionDigits:20})),[b,A]=m9({prop(N){const z=String(c);return isNaN(Number(z))||z!==N&&N!==""?N:y.current.format(Number(c))},defaultProp:w9,onChange(N){const z=C.current.parse(N??"");a(isNaN(z)?void 0:z)}}),T=N=>{A(String(N))},M=({target:{value:N}})=>{C.current.isValidPartialNumber(N)&&T(N)},V=()=>{if(!b){T(o);return}const N=C.current.parse(b),z=isNaN(N)?o:N+o;T(y.current.format(z))},L=()=>{if(!b){T(-o);return}const N=C.current.parse(b),z=isNaN(N)?-o:N-o;T(y.current.format(z))},_=N=>{if(!l)switch(N.key){case st.DOWN:{N.preventDefault(),L();break}case st.UP:{N.preventDefault(),V();break}}},D=()=>{if(b){const N=C.current.parse(b),z=isNaN(N)?"":y.current.format(N);T(z)}};return s.jsx(Wo,{ref:m,startAction:e,disabled:l,type:"text",inputMode:"decimal",onChange:M,onKeyDown:_,onBlur:D,value:b,endAction:s.jsxs(G,{direction:"column",children:[s.jsx(gc,{disabled:l,"aria-hidden":!0,$reverse:!0,onClick:V,tabIndex:-1,type:"button","data-testid":"ArrowUp",children:s.jsx(Vn,{fill:"neutral500"})}),s.jsx(gc,{disabled:l,"aria-hidden":!0,onClick:L,tabIndex:-1,type:"button","data-testid":"ArrowDown",children:s.jsx(Vn,{fill:"neutral500"})})]}),...u})}),gc=I.button`
  display: flex;
  justify-content: center;
  align-items: center;
  transform: translateY(${({$reverse:e})=>e?"-2px":"2px"});
  cursor: ${({disabled:e})=>e?"not-allowed":void 0};
  height: 1.1rem;

  svg {
    width: 1.2rem;
    transform: ${({$reverse:e})=>e?"rotateX(180deg)":void 0};
  }
`;function m9({prop:e,defaultProp:n,onChange:a=()=>{}}){const[c,o]=$l({defaultProp:n,onChange:a}),l=e!==void 0,u=e instanceof Function?e(c):e,m=l?u:c,v=Wa(a),R=h.useCallback(C=>{if(l){const b=typeof C=="function"?C(u):C;b!==u&&(v(b),o(C))}else o(C)},[l,u,o,v]);return[m,R]}const x9=h.createContext({activePage:1,pageCount:1}),mi=()=>h.useContext(x9);ht(({children:e,...n},a)=>{const{activePage:c}=mi(),o=c===1;return s.jsxs(t2,{ref:a,"aria-disabled":o,tabIndex:o?-1:void 0,...n,children:[s.jsx(sr,{children:e}),s.jsx(fl,{"aria-hidden":!0})]})});ht(({children:e,...n},a)=>{const{activePage:c,pageCount:o}=mi(),l=c===o;return s.jsxs(t2,{ref:a,"aria-disabled":l,tabIndex:l?-1:void 0,...n,children:[s.jsx(sr,{children:e}),s.jsx(si,{"aria-hidden":!0})]})});const e2=I(Dr)`
  padding: ${({theme:e})=>e.spaces[3]};
  border-radius: ${({theme:e})=>e.borderRadius};
  box-shadow: ${({$active:e,theme:n})=>e?n.shadows.filterShadow:void 0};
  text-decoration: none;
  display: flex;

  ${No}
`,t2=I(e2)`
  font-size: 1.1rem;

  svg path {
    fill: ${e=>e["aria-disabled"]?e.theme.colors.neutral300:e.theme.colors.neutral600};
  }

  &:focus,
  &:hover {
    svg path {
      fill: ${e=>e["aria-disabled"]?e.theme.colors.neutral300:e.theme.colors.neutral700};
    }
  }

  ${e=>e["aria-disabled"]?`
  pointer-events: none;
    `:void 0}
`;ht(({number:e,children:n,...a},c)=>{const{activePage:o}=mi(),l=o===e;return s.jsxs(v9,{ref:c,...a,"aria-current":l,$active:l,children:[s.jsx(sr,{children:n}),s.jsx(le,{"aria-hidden":!0,fontWeight:l?"bold":void 0,lineHeight:"revert",variant:"pi",children:e})]})});const v9=I(e2)`
  color: ${({theme:e,$active:n})=>n?e.colors.primary700:e.colors.neutral800};
  background: ${({theme:e,$active:n})=>n?e.colors.neutral0:void 0};

  &:hover {
    box-shadow: ${({theme:e})=>e.shadows.filterShadow};
  }
`,p9=h4,b9=h.forwardRef((e,n)=>s.jsx(X6,{...e,asChild:!0,ref:n})),$9=h.forwardRef((e,n)=>s.jsx(Q6,{children:s.jsx(C9,{sideOffset:4,side:"bottom",align:"start",...e,ref:n})})),C9=I(J6)`
  box-shadow: ${({theme:e})=>e.shadows.filterShadow};
  z-index: ${({theme:e})=>e.zIndices.popover};
  background-color: ${e=>e.theme.colors.neutral0};
  border: 1px solid ${({theme:e})=>e.colors.neutral150};
  border-radius: ${({theme:e})=>e.borderRadius};

  @media (prefers-reduced-motion: no-preference) {
    animation-duration: ${e=>e.theme.motion.timings[200]};

    &[data-state='open'] {
      animation-timing-function: ${e=>e.theme.motion.easings.authenticMotion};

      &[data-side='top'] {
        animation-name: ${qe.slideUpIn};
      }

      &[data-side='bottom'] {
        animation-name: ${qe.slideDownIn};
      }
    }

    &[data-state='closed'] {
      animation-timing-function: ${e=>e.theme.motion.easings.easeOutQuad};

      &[data-side='top'] {
        animation-name: ${qe.slideUpOut};
      }

      &[data-side='bottom'] {
        animation-name: ${qe.slideDownOut};
      }
    }
  }
`,y9=h.forwardRef(({children:e,intersectionId:n,onReachEnd:a,...c},o)=>{const l=h.useRef(null),u=xt(l,o),m=Wt();return Or(l,a??(()=>{}),{selectorToWatch:`#${rr(m)}`,skipWhen:!n||!a}),s.jsxs(S9,{ref:u,...c,children:[e,n&&a&&s.jsx(Z,{id:rr(m),width:"100%",height:"1px"})]})}),S9=I(Jl)`
  height: 20rem;
`,qb=Object.freeze(Object.defineProperty({__proto__:null,Content:$9,Root:p9,ScrollArea:y9,Trigger:b9},Symbol.toStringTag,{value:"Module"}));h.forwardRef(({size:e="M",value:n,...a},c)=>s.jsx(R9,{ref:c,$size:e,...a,children:s.jsx(_9,{style:{transform:`translate3D(-${100-(n??0)}%, 0, 0)`}})}));const R9=I(P6)`
  position: relative;
  overflow: hidden;
  width: ${e=>e.$size==="S"?"7.8rem":"10.2rem"};
  height: ${e=>e.$size==="S"?"0.4rem":"0.8rem"};
  background-color: ${e=>e.theme.colors.neutral600};
  border-radius: ${e=>e.theme.borderRadius};

  /* Fix overflow clipping in Safari */
  /* https://gist.github.com/domske/b66047671c780a238b51c51ffde8d3a0 */
  transform: translateZ(0);
`,_9=I(e4)`
  background-color: ${({theme:e})=>e.colors.neutral0};
  border-radius: ${({theme:e})=>e.borderRadius};
  width: 100%;
  height: 100%;

  @media (prefers-reduced-motion: no-preference) {
    transition: transform ${e=>e.theme.motion.timings[320]}
      ${e=>e.theme.motion.easings.authenticMotion};
  }
`;h.forwardRef((e,n)=>s.jsx(j9,{ref:n,...e}));const j9=I(t4)`
  display: flex;
  flex-direction: column;
  gap: ${e=>e.theme.spaces[3]};
`;h.forwardRef(({children:e,id:n,...a},c)=>{const o=Wt(n);return s.jsxs(G,{gap:2,children:[s.jsx(A9,{id:o,ref:c,...a,children:s.jsx(I9,{})}),s.jsx(le,{tag:"label",htmlFor:o,children:e})]})});const A9=I(n4)`
  background: ${e=>e.theme.colors.neutral0};
  width: 2rem;
  height: 2rem;
  flex: 0 0 2rem;
  border-radius: 50%;
  border: 1px solid ${e=>e.theme.colors.neutral300};
  position: relative;
  z-index: 0;

  @media (prefers-reduced-motion: no-preference) {
    transition: border-color ${e=>e.theme.motion.timings[120]}
      ${e=>e.theme.motion.easings.easeOutQuad};
  }

  &[data-state='checked'] {
    border: 1px solid ${e=>e.theme.colors.primary600};
  }

  &[data-disabled] {
    background-color: ${e=>e.theme.colors.neutral200};
  }

  /* increase target size for touch devices https://www.w3.org/WAI/WCAG21/Understanding/target-size.html */
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    height: 100%;
    min-width: 44px;
    min-height: 44px;
  }
`,I9=I(r4)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  position: relative;

  &[data-state='checked'] {
    @media (prefers-reduced-motion: no-preference) {
      animation: ${qe.popIn} ${e=>e.theme.motion.timings[200]};
    }
  }

  &::after {
    content: '';
    display: block;
    width: 1rem;
    height: 1rem;
    border-radius: 50%;
    background: ${e=>e.theme.colors.primary600};
  }
`,T9=e=>{const n=e.querySelector('[tabindex="0"]');n&&n.focus()},n2=h.createContext({rowIndex:0,colIndex:0,setTableValues(){throw new Error("setTableValues must be initialized via the RawTableContext.Provider")}}),M9=()=>h.useContext(n2),E9=h.forwardRef(({colCount:e,rowCount:n,jumpStep:a=3,initialCol:c=0,initialRow:o=0,...l},u)=>{const m=h.useRef(null),v=h.useRef(!1),R=xt(m,u),[C,y]=h.useState(o),[b,A]=h.useState(c),T=h.useCallback(({colIndex:L,rowIndex:_})=>{A(L),y(_)},[]);h.useEffect(()=>{v.current&&T9(m.current),v.current||(v.current=!0)},[b,C]);const M=L=>{switch(L.key){case st.RIGHT:{L.preventDefault(),A(_=>_<e-1?_+1:_);break}case st.LEFT:{L.preventDefault(),A(_=>_>0?_-1:_);break}case st.UP:{L.preventDefault(),y(_=>_>0?_-1:_);break}case st.DOWN:{L.preventDefault(),y(_=>_<n-1?_+1:_);break}case st.HOME:{L.preventDefault(),L.ctrlKey&&y(0),A(0);break}case st.END:{L.preventDefault(),L.ctrlKey&&y(n-1),A(e-1);break}case st.PAGE_DOWN:{L.preventDefault(),y(_=>_+a<n?_+a:n-1);break}case st.PAGE_UP:{L.preventDefault(),y(_=>_-a>0?_-a:0);break}}},V=h.useMemo(()=>({rowIndex:C,colIndex:b,setTableValues:T}),[b,C,T]);return s.jsx(n2.Provider,{value:V,children:s.jsx("table",{role:"grid",ref:R,"aria-rowcount":n,"aria-colcount":e,onKeyDown:M,...l})})}),Ar=(e,n)=>[...e.querySelectorAll('a, button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])')].filter(o=>!o.hasAttribute("disabled")),xa=e=>e.filter(n=>n.tagName==="INPUT"?n.type!=="checkbox"&&n.type!=="radio":!1),r2=h.forwardRef(({coords:e={col:0,row:0},tag:n="td",...a},c)=>{const o=h.useRef(null),l=xt(c,o),{rowIndex:u,colIndex:m,setTableValues:v}=M9(),[R,C]=h.useState(!1),y=T=>{const M=Ar(o.current);if(M.length===0||M.length===1&&xa(M).length===0)return;if(M.length>1&&!M.find(L=>L.tagName!=="BUTTON")){T.preventDefault();const L=M.findIndex(_=>_===document.activeElement);if(T.key===st.RIGHT){const _=M[L+1];_&&(T.stopPropagation(),_.focus())}else if(T.key===st.LEFT){const _=M[L-1];_&&(T.stopPropagation(),_.focus())}return}const V=T.key===st.ENTER;if(V&&!R)C(!0);else if((T.key===st.ESCAPE||V)&&R){if(V&&document.activeElement?.tagName==="A")return;C(!1),o.current.focus()}else R&&T.stopPropagation()},b=u===e.row-1&&m===e.col-1;or(()=>{const T=Ar(o.current);T.length===0||T.length===1&&xa(T).length!==0||T.length>1&&T.find(M=>M.tagName!=="BUTTON")?(o.current.setAttribute("tabIndex",!R&&b?"0":"-1"),T.forEach((M,V)=>{M.setAttribute("tabIndex",R?"0":"-1"),R&&V===0&&M.focus()})):T.forEach(M=>{M.setAttribute("tabIndex",b?"0":"-1")})},[R,b]);const A=h.useCallback(()=>{const T=Ar(o.current);T.length>=1&&(xa(T).length!==0||!T.find(M=>M.tagName!=="BUTTON"))&&C(!0),v({rowIndex:e.row-1,colIndex:e.col-1})},[e,v]);return or(()=>{const T=o.current;return Ar(T).forEach(V=>{V.addEventListener("focus",A)}),()=>{Ar(T).forEach(L=>{L.removeEventListener("focus",A)})}},[A]),s.jsx(Z,{role:"gridcell",tag:n,ref:l,onKeyDown:y,...a})}),L9=e=>s.jsx(r2,{...e,tag:"th"}),V9=({children:e,...n})=>{const a=h.Children.toArray(e).map(c=>h.isValidElement(c)?h.cloneElement(c,{"aria-rowindex":1}):c);return s.jsx("thead",{...n,children:a})},B9=({children:e,...n})=>{const a=h.Children.toArray(e).map((c,o)=>h.isValidElement(c)?h.cloneElement(c,{"aria-rowindex":o+2}):c);return s.jsx("tbody",{...n,children:a})},D9=({children:e,...n})=>{const a=h.Children.toArray(e).map((c,o)=>h.isValidElement(c)?h.cloneElement(c,{"aria-colindex":o+1,coords:{col:o+1,row:n["aria-rowindex"]}}):c);return s.jsx(Z,{tag:"tr",...n,children:a})},O9=I(On)`
  font-size: 0.5rem;
  path {
    fill: ${({theme:e})=>e.colors.neutral400};
  }
`,o2=I(yv)`
  font-size: 0.8rem;
  path {
    fill: ${({theme:e})=>e.colors.neutral800};
  }
`,H9=I.div`
  border-radius: ${({theme:e})=>e.borderRadius};
  box-shadow: ${({theme:e})=>e.shadows.filterShadow};

  &:focus-within {
    ${o2} {
      fill: ${({theme:e})=>e.colors.primary600};
    }
  }
`,N9=I(Wo)`
  border: 1px solid transparent;

  &:hover {
    button {
      cursor: pointer;
    }
  }

  ${bn()}
`;h.forwardRef(({name:e,children:n,value:a="",onClear:c,clearLabel:o,...l},u)=>{const m=h.useRef(null),v=a.length>0,R=y=>{c(y),m.current.focus()},C=Rl(u,m);return s.jsx(H9,{children:s.jsxs(Bn,{name:e,children:[s.jsx(sr,{children:s.jsx(fi,{children:n})}),s.jsx(N9,{ref:C,value:a,startAction:s.jsx(o2,{"aria-hidden":!0}),endAction:v?s.jsx(Hl,{label:o,onClick:R,onMouseDown:y=>{y.preventDefault()},children:s.jsx(O9,{})}):void 0,...l})]})})});const F9=I(Z)`
  display: inline-flex;
  border: none;

  & > svg {
    height: 1.2rem;
    width: 1.2rem;
  }

  & > svg path {
    fill: ${({theme:e,...n})=>n["aria-disabled"]?e.colors.neutral600:e.colors.primary600};
  }

  &:hover {
    cursor: ${({$iconAction:e})=>e?"pointer":"initial"};
  }
`,z9=({children:e,icon:n,label:a,disabled:c=!1,onClick:o,...l})=>{const u=m=>{c||!o||o(m)};return s.jsxs(G,{inline:!0,background:c?"neutral200":"primary100",color:c?"neutral700":"primary600",paddingLeft:3,paddingRight:1,borderColor:c?"neutral300":"primary200",hasRadius:!0,height:"3.2rem",...l,children:[s.jsx(W9,{$disabled:c,variant:"pi",fontWeight:"bold",children:e}),s.jsx(F9,{tag:"button",disabled:c,"aria-disabled":c,"aria-label":a,padding:2,onClick:u,$iconAction:!!o,children:n})]})},W9=I(le)`
  color: inherit;
  border-right: 1px solid ${({theme:e,$disabled:n})=>n?e.colors.neutral300:e.colors.primary200};
  padding-right: ${({theme:e})=>e.spaces[2]};
`;h.forwardRef(({children:e,clearLabel:n="Clear",customizeContent:a,disabled:c,hasError:o,id:l,name:u,onChange:m,onClear:v,onCloseAutoFocus:R,onReachEnd:C,placeholder:y,required:b,size:A,startIcon:T,value:M,withTags:V,...L},_)=>{const D=h.useRef(null),[N,z]=h.useState(),[X,q]=h.useState(!1),de=me=>{m?m(me):z(me)},ie=me=>()=>{const ze=Array.isArray(M)?M.filter(Ne=>Ne!==me):(N??[]).filter(Ne=>Ne!==me);m?m(ze):z(ze)},se=me=>{q(me)},$e=Wt(),ne=`intersection-${rr($e)}`;Or(D,me=>{C&&C(me)},{selectorToWatch:`#${ne}`,skipWhen:!X});const ee=typeof M<"u"&&M!==null?M:N,_e=me=>me&&typeof me=="object"&&me.value?s.jsx(z9,{tabIndex:-1,disabled:c,icon:s.jsx(On,{width:`${14/16}rem`,height:`${14/16}rem`}),onClick:ie(me.value),children:me.textValue},me.value):null,{error:je,...we}=vt("MultiSelect"),ye=!!je||o,Me=we.id??l,Be=we.name??u,he=we.required??b;let Je;return je?Je=`${Me}-error`:we.hint&&(Je=`${Me}-hint`),s.jsxs(zl,{onOpenChange:se,disabled:c,required:he,onValueChange:de,value:ee,...L,multi:!0,children:[s.jsx(Wl,{ref:_,id:Me,name:Be,"aria-label":L["aria-label"],"aria-describedby":Je??L["aria-describedby"],startIcon:T,hasError:ye,disabled:c,clearLabel:n,onClear:ee?.length?v:void 0,withTags:!!(V&&(ee?.length??!1)),size:A,children:s.jsx(kl,{placeholder:y,textColor:ee?.length?"neutral800":"neutral600",children:ee?.length?V?_e:a?a(ee):void 0:void 0})}),s.jsx(Ul,{children:s.jsx(ql,{position:"popper",sideOffset:4,onCloseAutoFocus:R,children:s.jsxs(Gl,{ref:D,children:[e,s.jsx(Z,{id:ne,width:"100%",height:"1px"})]})})})]})});const k9=h.forwardRef(({value:e,children:n,startIcon:a,...c},o)=>s.jsxs(wi,{ref:o,value:e.toString(),...c,children:[a&&s.jsx(Z,{tag:"span","aria-hidden":!0,children:a}),s.jsx(Kl,{children:({isSelected:l,isIntermediate:u})=>s.jsx(hi,{checked:u?"indeterminate":l})}),s.jsx(le,{children:s.jsx(Yl,{children:n})})]}));h.forwardRef(({children:e,label:n,startIcon:a,values:c=[],...o},l)=>s.jsxs(v8,{ref:l,children:[s.jsxs(wi,{value:c,...o,children:[a&&s.jsx(Z,{tag:"span","aria-hidden":!0,children:a}),s.jsx(Kl,{children:({isSelected:u,isIntermediate:m})=>s.jsx(hi,{checked:m?"indeterminate":u})}),s.jsx(le,{children:n})]}),e]}));I(k9)`
  padding-left: ${({theme:e})=>e.spaces[7]};
`;const U9="23.2rem";h.forwardRef(({...e},n)=>s.jsx(q9,{ref:n,...e,tag:"nav"}));const q9=I(Z)`
  width: ${U9};
  background: ${({theme:e})=>e.colors.neutral100};
  position: sticky;
  top: 0;
  height: 100vh;
  overflow-y: auto;
  border-right: 1px solid ${({theme:e})=>e.colors.neutral200};
  z-index: 1;
`;I(K8)`
  width: 2.4rem;
  background-color: ${({theme:e})=>e.colors.neutral200};
`;ht(({active:e,children:n,icon:a=null,withBullet:c=!1,isSubSectionChild:o=!1,...l},u)=>s.jsxs(G9,{background:"neutral100",paddingLeft:o?9:7,paddingBottom:2,paddingTop:2,ref:u,...l,children:[s.jsxs(G,{children:[a?s.jsx(K9,{children:a}):s.jsx(La,{$active:e}),s.jsx(le,{paddingLeft:2,children:n})]}),c&&s.jsx(G,{paddingRight:4,children:s.jsx(La,{$active:!0})})]}));const La=I.span`
  width: 0.4rem;
  height: 0.4rem;
  background-color: ${({theme:e,$active:n})=>n?e.colors.primary600:e.colors.neutral600};
  border-radius: 50%;
`,G9=I(Dr)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  text-decoration: none;
  color: ${({theme:e})=>e.colors.neutral800};
  svg > * {
    fill: ${({theme:e})=>e.colors.neutral600};
  }

  &.active {
    ${({theme:e})=>te`
        background-color: ${e.colors.primary100};
        border-right: 2px solid ${e.colors.primary600};
        color: ${e.colors.primary700};
        font-weight: 500;
      `}

    ${La} {
      background-color: ${({theme:e})=>e.colors.primary600};
    }
  }

  &:focus-visible {
    outline-offset: -2px;
  }
`,K9=I.div`
  svg {
    height: 1.6rem;
    width: 1.6rem;
  }
`;I.button`
  border: none;
  padding: 0;
  background: transparent;
  display: flex;
  align-items: center;
`;I(Z)`
  & > svg {
    height: 0.4rem;
    fill: ${({theme:e})=>e.colors.neutral500};
  }
`;h.forwardRef(({visibleLabels:e,onLabel:n="On",offLabel:a="Off",onCheckedChange:c,checked:o,defaultChecked:l,disabled:u,...m},v)=>{const[R,C]=Kt({prop:o,defaultProp:l}),y=b=>{C(b)};return s.jsxs(G,{gap:3,children:[s.jsx(Y9,{ref:v,onCheckedChange:En(c,y),checked:R,disabled:u,...m,children:s.jsx(Z9,{})}),e?s.jsx(X9,{"aria-hidden":!0,"data-disabled":u,"data-state":R?"checked":"unchecked",children:R?n:a}):null]})});const Y9=I(o4)`
  width: 4rem;
  height: 2.4rem;
  border-radius: 1.2rem;
  background-color: ${({theme:e})=>e.colors.danger500};

  &[data-state='checked'] {
    background-color: ${({theme:e})=>e.colors.success500};
  }

  &[data-disabled] {
    background-color: ${({theme:e})=>e.colors.neutral300};
  }

  @media (prefers-reduced-motion: no-preference) {
    transition: ${e=>e.theme.transitions.backgroundColor};
  }
`,Z9=I(a4)`
  display: block;
  height: 1.6rem;
  width: 1.6rem;
  border-radius: 50%;
  background-color: ${({theme:e})=>e.colors.neutral0};
  transform: translateX(4px);

  &[data-state='checked'] {
    transform: translateX(20px);
  }

  @media (prefers-reduced-motion: no-preference) {
    transition: transform ${e=>e.theme.motion.timings[120]}
      ${e=>e.theme.motion.easings.authenticMotion};
  }
`,X9=I(le)`
  color: ${e=>e.theme.colors.danger600};

  &[data-state='checked'] {
    color: ${e=>e.theme.colors.success600};
  }

  &[data-disabled='true'] {
    color: ${({theme:e})=>e.colors.neutral500};
  }
`,[Q9,xi]=Br("Tabs");h.forwardRef(({disabled:e=!1,variant:n="regular",hasError:a,...c},o)=>s.jsx(Q9,{disabled:e,hasError:a,variant:n,children:s.jsx(J9,{ref:o,...c})}));const J9=I(i4)`
  width: 100%;
  position: relative;
`;h.forwardRef((e,n)=>{const{variant:a}=xi("List");return s.jsx(P9,{ref:n,...e,$variant:a})});const P9=I(s4)`
  display: flex;
  align-items: ${e=>e.$variant==="regular"?"flex-end":"unset"};
  position: relative;
  z-index: 0;
`;h.forwardRef(({children:e,disabled:n,...a},c)=>{const{disabled:o,variant:l,hasError:u}=xi("Trigger"),m=o===!0||o===a.value||n,v=u===a.value;return s.jsxs(eb,{ref:c,...a,$hasError:v,$variant:l,disabled:m,children:[s.jsx(i2,{fontWeight:"bold",variant:l==="simple"?"sigma":void 0,children:e}),l==="simple"?s.jsx(a2,{}):null]})});const a2=I.span`
  display: block;
  width: 100%;
  background-color: currentColor;
  position: absolute;
  bottom: 0;
  left: 0;
  opacity: 0;
  height: 0.2rem;
`,i2=I(le)``,eb=I(c4)`
  position: relative;
  color: ${e=>e.$hasError?e.theme.colors.danger600:e.theme.colors.neutral600};
  cursor: pointer;
  z-index: 0;

  ${e=>e.$variant==="simple"?te`
        padding-block: ${n=>n.theme.spaces[4]};
        padding-inline: ${n=>n.theme.spaces[4]};

        & > ${i2} {
          line-height: 1.2rem;
        }

        &[data-state='active'] {
          color: ${e.$hasError?e.theme.colors.danger600:e.theme.colors.primary700};

          & > ${a2} {
            opacity: 1;
          }
        }
      `:te`
        padding-block: ${n=>n.theme.spaces[3]};
        padding-inline: ${n=>n.theme.spaces[3]};
        flex: 1;
        background-color: ${n=>n.theme.colors.neutral100};
        border-bottom: solid 1px ${n=>n.theme.colors.neutral150};

        &:not([data-state='active']) + &:not([data-state='active']) {
          border-left: solid 1px ${n=>n.theme.colors.neutral150};
        }

        &[data-state='active'] {
          padding-block: ${n=>n.theme.spaces[4]};
          padding-inline: ${n=>n.theme.spaces[4]};
          color: ${e.$hasError?e.theme.colors.danger600:e.theme.colors.primary700};
          border-top-right-radius: ${n=>n.theme.borderRadius};
          border-top-left-radius: ${n=>n.theme.borderRadius};
          background-color: ${n=>n.theme.colors.neutral0};
          border-bottom: solid 1px ${n=>n.theme.colors.neutral0};
          box-shadow: ${e.theme.shadows.tableShadow};
          z-index: 1;
        }
      `}

  &[data-disabled] {
    cursor: not-allowed;
    color: ${e=>e.theme.colors.neutral400};
  }
`;h.forwardRef((e,n)=>{const{variant:a}=xi("Content");return s.jsx(tb,{$variant:a,ref:n,...e})});const tb=I(l4)`
  ${e=>e.$variant==="simple"?te``:te`
        position: relative;
        z-index: 1;
        background-color: ${n=>n.theme.colors.neutral0};
      `}
`,nb=I(Z)`
  overflow: hidden;
  border: 1px solid ${({theme:e})=>e.colors.neutral150};
`,rb=I(E9)`
  width: 100%;
  white-space: nowrap;
`,ob=I(Z)`
  &:before {
    // TODO: make sure to add a token for this weird stuff
    background: linear-gradient(90deg, #c0c0cf 0%, rgba(0, 0, 0, 0) 100%);
    opacity: 0.2;
    position: absolute;
    height: 100%;
    content: ${({$overflowing:e})=>e==="both"||e==="left"?"''":void 0};
    box-shadow: ${({theme:e})=>e.shadows.tableShadow};
    width: ${({theme:e})=>e.spaces[2]};
    left: 0;
  }

  &:after {
    // TODO: make sure to add a token for this weird stuff
    background: linear-gradient(270deg, #c0c0cf 0%, rgba(0, 0, 0, 0) 100%);
    opacity: 0.2;
    position: absolute;
    height: 100%;
    content: ${({$overflowing:e})=>e==="both"||e==="right"?"''":void 0};
    box-shadow: ${({theme:e})=>e.shadows.tableShadow};
    width: ${({theme:e})=>e.spaces[2]};
    right: 0;
    top: 0;
  }
`,ab=I(Z)`
  overflow-x: auto;
`,Gb=h.forwardRef(({footer:e,...n},a)=>{const c=h.useRef(null),[o,l]=h.useState(),u=m=>{const v=m.target.scrollWidth-m.target.clientWidth;if(m.target.scrollLeft===0){l("right");return}if(m.target.scrollLeft===v){l("left");return}m.target.scrollLeft>0&&l("both")};return h.useEffect(()=>{c.current.scrollWidth>c.current.clientWidth&&l("right")},[]),s.jsxs(nb,{shadow:"tableShadow",hasRadius:!0,background:"neutral0",children:[s.jsx(ob,{$overflowing:o,position:"relative",children:s.jsx(ab,{ref:c,onScroll:u,paddingLeft:6,paddingRight:6,children:s.jsx(rb,{ref:a,...n})})}),e]})}),ib=I(B9)`
  & tr:last-of-type {
    border-bottom: none;
  }
`,Kb=({children:e,...n})=>s.jsx(ib,{...n,children:e}),sb=I(V9)`
  border-bottom: 1px solid ${({theme:e})=>e.colors.neutral150};
`,Yb=({children:e,...n})=>s.jsx(sb,{...n,children:e}),cb=I(D9)`
  border-bottom: 1px solid ${({theme:e})=>e.colors.neutral150};

  & td,
  & th {
    padding: ${({theme:e})=>e.spaces[4]};
  }

  & td:first-of-type,
  & th:first-of-type {
    padding: 0 ${({theme:e})=>e.spaces[1]};
  }

  // Resetting padding values and fixing a height
  th {
    padding-top: 0;
    padding-bottom: 0;
    height: 5.6rem;
  }
`,Zb=e=>s.jsx(cb,{...e}),s2=I(r2)`
  vertical-align: middle;
  text-align: left;
  outline-offset: -4px;

  /**
  * Hack to make sure the checkbox looks aligned
  */
  input {
    vertical-align: sub;
  }
`,Xb=h.forwardRef(({children:e,action:n,...a},c)=>s.jsx(s2,{color:"neutral600",as:L9,ref:c,...a,children:s.jsxs(G,{children:[e,n]})})),Qb=h.forwardRef(({children:e,...n},a)=>s.jsx(s2,{color:"neutral800",ref:a,...n,children:e}));I(Z)`
  height: 2.4rem;
  width: 2.4rem;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;

  svg {
    height: 1rem;
    width: 1rem;
  }

  svg path {
    fill: ${({theme:e})=>e.colors.primary600};
  }
`;I(Z)`
  border-radius: 0 0 ${({theme:e})=>e.borderRadius} ${({theme:e})=>e.borderRadius};
  display: block;
  width: 100%;
  border: none;
`;ht(({children:e,startIcon:n,endIcon:a,disabled:c=!1,loading:o=!1,...l},u)=>{const m=c||o;return s.jsxs(db,{ref:u,disabled:m,"aria-disabled":m,tag:"button",type:"button",gap:2,...l,children:[o?s.jsx(ub,{"aria-hidden":!0,children:s.jsx(gl,{})}):n,s.jsx(le,{variant:"pi",children:e}),a]})});const lb=it`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(359deg);
  }
`,ub=I.span`
  display: flex;
  animation: ${lb} 2s infinite linear;
  will-change: transform;
`,db=I(G)`
  border: none;
  background-color: transparent;
  color: ${e=>e.theme.colors.primary600};
  cursor: pointer;

  &[aria-disabled='true'] {
    pointer-events: none;
    color: ${e=>e.theme.colors.neutral600};
  }

  ${No}
`,hb=h.forwardRef((e,n)=>s.jsx(Wo,{ref:n,...e}));hb.displayName="TextInput";const Jb=h.forwardRef(({disabled:e,hasError:n,id:a,name:c,required:o,...l},u)=>{const{error:m,...v}=vt("Textarea"),R=!!m||n,C=v.id??a,y=v.name??c,b=v.required||o;let A;return m?A=`${C}-error`:v.hint&&(A=`${C}-hint`),s.jsx(fb,{borderColor:R?"danger600":"neutral200",$hasError:R,hasRadius:!0,children:s.jsx(gb,{"aria-invalid":R,"aria-required":b,tag:"textarea",background:e?"neutral150":"neutral0",color:e?"neutral600":"neutral800",disabled:e,fontSize:2,hasRadius:!0,ref:u,lineHeight:4,padding:4,width:"100%",height:"100%",id:C,name:y,"aria-describedby":A,...l})})}),fb=I(Z)`
  height: 10.5rem;
  ${bn()}
`,gb=I(Z)`
  border: none;
  resize: none;

  ::placeholder {
    color: ${({theme:e})=>e.colors.neutral500};
    font-size: ${({theme:e})=>e.fontSizes[2]};
    color: ${({theme:e})=>e.colors.neutral500};
    opacity: 1;
  }

  &:focus-within {
    outline: none;
  }
`,Pb=h.forwardRef(({offLabel:e,onLabel:n,disabled:a,hasError:c,required:o,id:l,name:u,checked:m,onChange:v,...R},C)=>{const[y=!1,b]=Kt({prop:m}),A=y!==null&&!y,{error:T,...M}=vt("Toggle"),V=!!T||c,L=M.id??l,_=M.name??u,D=M.required||o;let N;return T?N=`${L}-error`:M.hint&&(N=`${L}-hint`),s.jsxs(wb,{position:"relative",hasRadius:!0,padding:1,background:a?"neutral150":"neutral100",borderStyle:"solid",borderWidth:"1px",borderColor:"neutral200",wrap:"wrap",cursor:a?"not-allowed":"pointer",$hasError:V,children:[s.jsx(wc,{hasRadius:!0,flex:"1 1 50%",paddingTop:2,paddingBottom:2,paddingLeft:3,paddingRight:3,justifyContent:"center",background:a&&A?"neutral200":A?"neutral0":"transparent",borderColor:a&&A?"neutral300":A?"neutral200":a?"neutral150":"neutral100",children:s.jsx(le,{variant:"pi",fontWeight:"bold",textTransform:"uppercase",textColor:a?"neutral700":A?"danger700":"neutral600",children:e})}),s.jsx(wc,{hasRadius:!0,flex:"1 1 50%",paddingLeft:3,paddingRight:3,justifyContent:"center",background:a&&y?"neutral200":y?"neutral0":"transparent",borderColor:a&&y?"neutral300":y?"neutral200":a?"neutral150":"neutral100",children:s.jsx(le,{variant:"pi",fontWeight:"bold",textTransform:"uppercase",textColor:a?"neutral700":y?"primary600":"neutral600",children:n})}),s.jsx(mb,{...R,id:L,name:_,ref:C,onChange:z=>{b(z.currentTarget.checked),v?.(z)},type:"checkbox","aria-required":D,disabled:a,"aria-disabled":a,checked:!!y,"aria-describedby":N})]})}),wb=I(G)`
  ${bn()}
`,wc=I(G)`
  padding-block: 0.6rem;
`,mb=I.input`
  height: 100%;
  left: 0;
  opacity: 0;
  position: absolute;
  top: 0;
  z-index: 0;
  width: 100%;
`,xb=ht((e,n)=>{const{gap:a=0,gridCols:c=12,...o}=e;return s.jsx(vb,{ref:n,$gap:a,$gridCols:c,...o})}),vb=I(Z)`
  display: grid;
  grid-template-columns: repeat(${({$gridCols:e})=>e}, 1fr);
  ${({theme:e,$gap:n})=>Ho({gap:n},e)}
`,pb=ht(({col:e,s:n,xs:a,m:c,...o},l)=>s.jsx(bb,{ref:l,$col:e,$s:n,$xs:a,$m:c,...o})),bb=I(G)`
  grid-column: span ${({$xs:e})=>e??12};
  max-width: 100%;

  ${({theme:e})=>e.breakpoints.small} {
    grid-column: span ${({$s:e,$xs:n})=>e??n??12};
  }

  ${({theme:e})=>e.breakpoints.medium} {
    grid-column: span ${({$m:e,$s:n,$xs:a})=>e??n??a??12};
  }

  ${({theme:e})=>e.breakpoints.large} {
    grid-column: span ${({$col:e,$m:n,$s:a,$xs:c})=>e??n??a??c??12};
  }
`,e$=Object.freeze(Object.defineProperty({__proto__:null,Item:pb,Root:xb},Symbol.toStringTag,{value:"Module"}));export{Lb as A,Wp as B,kp as C,$8 as D,Pv as E,Ib as F,e$ as G,Ab as H,Ma as I,Fb as J,Vn as K,n7 as L,kb as M,Ub as N,Oa as O,qb as P,zb as Q,Tb as R,cc as S,Gb as T,Nb as U,sr as V,Bb as W,Wb as X,Mb as Y,Eb as Z,Rb as _,Yb as a,Zb as b,Xb as c,le as d,Kb as e,Qb as f,G as g,Ta as h,Vb as i,Pb as j,hb as k,Db as l,Z as m,Cb as n,Sb as o,Wa as p,yb as q,xt as r,hi as s,Hb as t,x4 as u,lc as v,_b as w,jb as x,Jb as y,U8 as z};
