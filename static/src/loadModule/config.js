(function(win){
var flieMap = function(){
    this.config = {
        "basePath":"static/",
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
                version:"v0.1",
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
    flieMap.prototype={
        initData:function(){//初始化改页面需要的 模块配置
            this.htmlName = win.htmlName || "";
            this.moduleFileSet={};
            var config = this.config;
            for(var key in config.global){
               // console.log(key)
                var jsonNode = this.JsonNode(config.global[key],["js","css"]);
                this.moduleFileSet[key] = jsonNode;
                //console.log(this.JsonNode(config.global[key],["js","css"]))
            }
            this.moduleFileSet[this.htmlName] =this.JsonNode(config.modules[this.htmlName],["js","css"]);
            /* for(var key in this.moduleFileSet)
             {
                console.log(key);
             }*/
            return this;
        },
        getBasePath:function(){//返回路径
            return this.config.basePath;
        },
        getUpdateFileSet:function(needupdate){//根据检测版本返回的数组 返回需要更新的模块 url的json
            var cssFlieSet = [],
                jsFlieSet = [],
                resultSet = {"js":[],"css":[]};
            
            var moduleFileSet = this.moduleFileSet;
            for(var index in needupdate){
                var js = moduleFileSet[needupdate[index]]["js"],
                    css = moduleFileSet[needupdate[index]]["css"];
                if(js){
                    jsFlieSet = jsFlieSet.concat(js);
                }
                if(css){
                    cssFlieSet = cssFlieSet.concat(css);
                }
            }
            for(var index in jsFlieSet){
                var url = this.config.modulesMap[jsFlieSet[index]];
                resultSet.js = resultSet.js.concat(url);
            }
            for(var index in cssFlieSet){
                var url = this.config.modulesMap[cssFlieSet[index]];
                resultSet.css = resultSet.css.concat(url);
            }
            return resultSet;
        },
        getMapValue:function(key){//根据模块名值返回 改模块的url
            return this.config.modulesMap[key];
        },
        JsonNode:function(jsonObj,node){//重新组合 一个新的json ，node为 要从jsonObj中提取的节点
            var innerJson = jsonObj,
                node = node || [],
                resultJson = {};
            for(var index in node){
              resultJson[node[index]] = jsonObj[node[index]];
            }
            //console.log(resultJson)
            return resultJson;
            
        },
        getVersion:function(){//获取模块版本json
            var resultSet = {};
            
            var config = this.config;
            
            for(var key in config.global){
                    resultSet[key]=config.global[key].version;
            }
            resultSet[this.htmlName]=config.modules[this.htmlName].version
            
            return resultSet;
        }
    
        
    }
    win.flieMap = new flieMap();
   
})(window)




