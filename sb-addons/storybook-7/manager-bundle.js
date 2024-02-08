try{
(()=>{var y=__STORYBOOK_API__,{ActiveTabs:x,Consumer:S,ManagerContext:f,Provider:_,addons:r,combineParameters:T,controlOrMetaKey:v,controlOrMetaSymbol:O,eventMatchesShortcut:A,eventToShortcut:M,isMacLike:P,isShortcutTaken:j,keyToSymbol:C,merge:I,mockChannel:w,optionOrAltSymbol:B,shortcutMatchesShortcut:G,shortcutToHumanString:K,types:R,useAddonState:z,useArgTypes:H,useArgs:Y,useChannel:E,useGlobalTypes:N,useGlobals:q,useParameter:D,useSharedState:J,useStoryPrepared:U,useStorybookApi:V,useStorybookState:L}=__STORYBOOK_API__;var Z=__STORYBOOK_THEMING__,{CacheProvider:$,ClassNames:ee,Global:te,ThemeProvider:oe,background:re,color:se,convert:ae,create:s,createCache:ie,createGlobal:ne,createReset:ce,css:pe,darken:le,ensure:ue,ignoreSsrWarning:me,isPropValid:de,jsx:be,keyframes:he,lighten:ge,styled:ke,themes:ye,typography:xe,useTheme:Se,withTheme:fe}=__STORYBOOK_THEMING__;var a={name:"ai-text-processor",version:"1.0.13",author:"Justin Mahar <contact@justinmahar.com>",description:"Utility for processing text using AI. Summarize, analyze, extract, translate, format, and more! \u2728",homepage:"https://justinmahar.github.io/ai-text-processor/",main:"./dist/index.js",types:"./dist/index.d.ts",scripts:{build:"rm -rf ./dist && tsc",test:"npm run build",start:"npm run storybook",storybook:"storybook dev -p 6006","build-storybook":"storybook build",preship:'npm run build && git diff-index --quiet HEAD && npm version patch -m "Build, version, and publish."',ship:"npm publish --access public",postship:"git push",update:"rm -rf .lockblocks && git clone -q git@github.com:justinmahar/react-kindling.git ./.lockblocks && lockblocks ./.lockblocks . --verbose && rm -rf .lockblocks && echo '' && echo ' \u2192 Be sure to run `npm i` to install new dependencies.' && echo ''",postupdate:"node remove-peer-deps.js"},license:"MIT",repository:{type:"git",url:"git+https://github.com/justinmahar/ai-text-processor.git"},bugs:{url:"https://github.com/justinmahar/ai-text-processor/issues"},keywords:["ai","openai","gpt","chatgpt","text","process","processor","processing","summary","summarize","summarization","extract","extractor","extraction","meaning","translate","translation","language","natural","nlp","sentiment","analysis","data","chat","model","models","chunk","chunking","preset","presets","utility","token","tokens","count"],devDependencies:{"@storybook/addon-essentials":"^7.6.12","@storybook/react":"^7.6.12","@types/react-icons":"^3.0.0","@typescript-eslint/eslint-plugin":"^6.20.0","@typescript-eslint/parser":"^6.20.0",bootstrap:"^5.3.2",classnames:"^2.3.2","copy-to-clipboard":"^3.3.3",eslint:"^8.56.0","eslint-config-prettier":"^9.1.0","eslint-plugin-prettier":"^5.1.3","eslint-plugin-react":"^7.33.2","eslint-plugin-react-hooks":"^4.6.0","eslint-plugin-storybook":"^0.6.15",lockblocks:"^1.1.4","openai-ext":"^1.2.7",prettier:"^3.2.5",react:"^18.2.0","react-bootstrap":"^2.8.0","react-dom":"^18.2.0","react-html-props":"^2.0.3","react-icons":"^4.11.0","react-markdown":"^8.0.5","react-storage-complete":"^1.1.5","react-use-precision-timer":"^3.3.1","remark-gfm":"^3.0.1","replace-in-file":"^7.1.0","styled-components":"^6.1.0",typescript:"^5.3.3",webpack:"^5.90.1","@storybook/addon-docs":"^7.6.12","@storybook/addon-viewport":"^7.6.12","@storybook/blocks":"^7.6.12","@storybook/react-webpack5":"^7.6.12","@types/react":"^18.2.53",storybook:"^7.6.12"},coreVersion:"3.0.2"};var c="\u{1F4D6} AI Text Processor",p=a.homepage,l="light",u=void 0,i=s({base:l,brandTitle:c,brandUrl:p,brandImage:u});r.setConfig({theme:i});})();
}catch(e){ console.error("[Storybook] One of your manager-entries failed: " + import.meta.url, e); }
