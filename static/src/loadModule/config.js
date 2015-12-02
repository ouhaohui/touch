(function(win){
var fileMap = function(){
    this.config = {
        "basePath":"/static/",
        global:{
            "jquery":{
                "version":"v1.11.2",
                "js":["jquery"]
            },
            "mmenu":{
                "version":"v5.0.4",
                "js":["mmenu"],
                "css":["mmenu-css"]
            }
        },
        "modules":{
            "htmlName123":{
                version:"v0.1",
                "js":[],
                "css":[]
            },
            "test":{
                version:"v0.20",
                "js":["test","maintest"],
                "css":["boostrap-css","test-css"]
            }
            
        },
        "modulesMap":{
            "jquery":"third/jquery.min.js",//js
            "mmenu":"third/mmenu/jquery.mmenu.min.all.js",
            "test":"js/test.js",
            "maintest":"js/maintest.js",

            "mmenu-css":"third/mmenu/jquery.mmenu.all.css",//css
            "boostrap-css":"css/boostrap.css",
            "test-css":"css/test-css.css"
        }
    }
    
    return this.initData();
}
    fileMap.prototype={
        initData:function(){//初始化改页面需要的 模块配置
            this.htmlName = win.htmlName || "";
            this.needLoadFileSet = this.getNeedLoadFileSet();
            this.versionSet = this.getVersion();
            this.moduleNameSet = this.getNeedLoadModuleName();
            /* for(var key in this.moduleFileSet)
             {
                console.log(key);
             }*/
            return this;
        },
        getBasePath:function(){//返回路径
            return this.config.basePath;
        },
        /**  
        * 返回{模块名：[js文件url , css文件url]
        */
        getNeedLoadFileSet:function(){//根据检测版本返回的数组 返回需要更新的模块 url的json
            var needupdate = this.getNeedLoadModuleName();//[模块名]
                resultSet = {};
            
            var moduleFileSet = this.getModuleChildrenSet();
            for(var index in needupdate){
                var fileSet = [],
                    moduleName = needupdate[index],
                    modulefile = moduleFileSet[moduleName];
                if(modulefile){
                    fileSet = fileSet.concat(modulefile);
                }
                
                for(var index2 in fileSet){
                var url =this.getBasePath() + this.config.modulesMap[fileSet[index2]];
                if(!(resultSet[moduleName] instanceof Array)){
                    resultSet[moduleName] = [];
                }
                resultSet[moduleName] = resultSet[moduleName].concat(url);
            }
            }
            return resultSet;
        },
        getMapValue:function(key){//根据模块名值返回 改模块的url
            return this.config.modulesMap[key];
        },
            /**  
            * 将对象中的 node 节点 重新封装成新的数组返回
            * @param jsonObj:目标json对象  
            * @param newObjName:新的json名字  
            * @param node:从jsonObj哪些节点提取组合
            */
        JsonNode:function(jsonObj,newObjName,node){
            var innerJson = jsonObj,
                node = node || [],
                resultJson = [];
            if(jsonObj == undefined){
                return
            }
            for(var index in node){
                if(jsonObj[node[index]]){
                   // console.log(jsonObj[node[index]]);
                   resultJson = resultJson.concat(jsonObj[node[index]]);
                   // console.log(resultJson)
                };
              
            }
            
            return resultJson;
            
        },
        /**  
        * 获取从模块版本json 
        */
        getVersion:function(){
            var resultSet = {},
                config = this.config,
                htmlModule = config.modules[this.htmlName];
            
            for(var key in config.global){
                resultSet[key]=config.global[key].version;
            }
            if(this.htmlName != undefined && this.htmlName != ""){
                resultSet[this.htmlName]=htmlModule != undefined?htmlModule.version : null;
            }
            return resultSet;
        },
        /**  
        * 从config中获取需要加载的模块名，return []
        */
        getNeedLoadModuleName:function(){
            var resultSet = [];
            var config = this.config;
             for(var key in config.global){
                    resultSet.push(key)
            }
            resultSet.push(this.htmlName);
            return resultSet;
        },
         /**  
        * 从config获取模块js css 模块名集合，return []（js css组合成一个数据）
        */
        getModuleChildrenSet:function(){
            var config = this.config,
                resultSet={};
            for(var key in config.global){
               // console.log(key)
                var jsonNode = this.JsonNode(config.global[key],key,["js","css"]);
                resultSet[key] = jsonNode;
                //console.log(this.JsonNode(config.global[key],["js","css"]))
            }
            resultSet[this.htmlName] =this.JsonNode(config.modules[this.htmlName],this.htmlName,["js","css"]);
            return resultSet;
        }
        
    }
    win.fileMap = new fileMap();
   
})(window)




