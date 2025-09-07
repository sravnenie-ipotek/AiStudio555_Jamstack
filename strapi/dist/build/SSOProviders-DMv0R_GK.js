import{u as d,j as t,aj as i,bL as r,aB as h,a5 as m,s as c,a3 as u}from"./strapi-CQJ1aB9a.js";const g=({providers:e,displayAllProviders:a})=>{const{formatMessage:o}=d();return a?t.jsx(i.Root,{gap:4,children:e.map(s=>t.jsx(i.Item,{col:4,direction:"column",alignItems:"stretch",children:t.jsx(n,{provider:s})},s.uid))}):e.length>2&&!a?t.jsxs(i.Root,{gap:4,children:[e.slice(0,2).map(s=>t.jsx(i.Item,{col:4,direction:"column",alignItems:"stretch",children:t.jsx(n,{provider:s})},s.uid)),t.jsx(i.Item,{col:4,direction:"column",alignItems:"stretch",children:t.jsx(r,{label:o({id:"global.see-more"}),children:t.jsx(l,{as:h,to:"/auth/providers",children:t.jsx("span",{"aria-hidden":!0,children:"•••"})})})})]}):t.jsx(x,{justifyContent:"center",children:e.map(s=>t.jsx(n,{provider:s},s.uid))})},x=c(u)`
  & a:not(:first-child):not(:last-child) {
    margin: 0 ${({theme:e})=>e.spaces[2]};
  }
  & a:first-child {
    margin-right: ${({theme:e})=>e.spaces[2]};
  }
  & a:last-child {
    margin-left: ${({theme:e})=>e.spaces[2]};
  }
`,n=({provider:e})=>t.jsx(r,{label:e.displayName,children:t.jsx(l,{href:`${window.strapi.backendURL}/admin/connect/${e.uid}`,children:e.icon?t.jsx("img",{src:e.icon,"aria-hidden":!0,alt:"",height:"32px"}):t.jsx(m,{children:e.displayName})})}),l=c.a`
  width: 13.6rem;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 4.8rem;
  border: 1px solid ${({theme:e})=>e.colors.neutral150};
  border-radius: ${({theme:e})=>e.borderRadius};
  text-decoration: inherit;
  &:link {
    text-decoration: none;
  }
  color: ${({theme:e})=>e.colors.neutral600};
`;export{g as S};
