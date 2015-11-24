---
create-date:  11/22/2015 2:41:31 PM 
status: public
this document about of the js lib devolement prograss
---
 
###config.js
初步接口如下：  
>1、基本路径返回 getBasePath return string;  
>2、返回需要更新的静态文件url集合 getUpdateFileSet(array[模块名]) return json{"js";"","css":""};  
>3、获取模块名对应的url getMapValue(ModuleName) return string;  
>4、工具类方法， 提取原json内的部分节点，重新返回一个新的json对象，JsonNode(jsonObj,node[]) return json  
>5、获取该html页面 所需要加载的模块的版本， getVersion() return json.

###下一步
整理逻辑，增加容错率。
###isue

###bugfix