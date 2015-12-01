---
create-date:  11/22/2015 2:41:31 PM 
update-date:12/1/2015 4:30:54 PM 
status: public
this document about of the js lib devolement prograss
---

##update:
修改resource.js，完成loadModule模块。
###config.js
初步接口如下：  
>1、基本路径返回 getBasePath return string;  
>2、返回需要更新的静态文件url集合 getUpdateFileSet(array[模块名]) return json{"js";"","css":""};  
>3、获取模块名对应的url getMapValue(ModuleName) return string;  
>4、工具类方法， 提取原json内的部分节点，重新返回一个新的json对象，JsonNode(jsonObj,node[]) return json  
>5、获取该html页面 所需要加载的模块的版本， getVersion() return json.
###resource.js
>已修改源文件至合适需求。需求如下  
>1、模块版本管理，包括更新，添加模块。  
>2、增加中间对象粘合config.js与resource.js
###下一步
测试加载性能。
合并文件。
###isue

###bugfix