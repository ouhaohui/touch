//需要引用别的js的时候，就加上如Env.require("cookie.js")，或Env.require("/common/cookie.js")，是用相对路径还是绝对路径就看喜好了。
//Env.require可用在页面模板中，也可用在js文件中，但一定要保证执行时env.js被显式引入。
//多次Env.require同一个js（不管用相对还是绝对），只有第一次会加载，所以不会重复。

//程序最后发行的版本，用于作为缓存键的前缀，快速更新缓存
var envLastVer = '2015_11_17_17_03';

//用于存放通道名称及通信对象的类，这样可以通过不同通道名称来区分不同的通信对象  
function HttpRequestObject() {
    this.chunnel = null;
    this.instance = null;
}

//用于获取的脚本或css文件保存对象
function HttpGetObject() {
    this.url = null;        //要下载的文件路径
    this.cache_key = null;  //缓存键
    this.version = null;
    this.index = null;      //config文件里面的下表0开始     
    this.chunnel = null;    //通道名
    this.type = null;       //类型，js或css
    this.is_fill = false;   //内容是否被填充
    this.is_exec = false;   //内容是否已被执行，防止分几大块载入后重复执行
}

//通信处理类，可以静态引用其中的方法  
var Request = new function (){

    //通信类的缓存  
    this.httpRequestCache = new Array();

    //创建新的通信对象 
    this.createInstance = function () {
        var instance = null;
        if (window.XMLHttpRequest) {
            //mozilla  
            instance = new XMLHttpRequest();
            //有些版本的Mozilla浏览器处理服务器返回的未包含XML mime-type头部信息的内容时会出错。
            //因此，要确保返回的内容包含text/xml信息  
            if (instance.overrideMimeType) {
                instance.overrideMimeType = "text/xml";
            }
        }
        else if (window.ActiveXObject) {
            //IE  
            var MSXML = ['MSXML2.XMLHTTP.5.0', 'Microsoft.XMLHTTP', 'MSXML2.XMLHTTP.4.0', 'MSXML2.XMLHTTP.3.0', 'MSXML2.XMLHTTP'];
            for (var i = 0; i < MSXML.length; i++) {
                try {
                    instance = new ActiveXObject(MSXML[i]);
                    break;
                }
                catch (e) {
                }
            }
        }
        return instance;
    }

    /**  
    * 获取一个通信对象  
    * 若没指定通道名称，则默认通道名为"default"  
    * 若缓存中不存在需要的通信类，则创建一个，同时放入通信类缓存中  
    * @param _chunnel：通道名称，若不存在此参数，则默认为"default"  
    * @return 一个通信对象，其存放于通信类缓存中  
    */
    this.getInstance = function (_chunnel) {
        var instance = null;
        var object = null;
        if (_chunnel == undefined)//没指定通道名称  
        {
            _chunnel = "default";
        }
        var getOne = false;
        for (var i = 0; i < this.httpRequestCache; i++) {
            object = HttpRequestObject(this.httpRequestCache[i]);
            if (object.chunnel == _chunnel) {
                if (object.instance.readyState == 0 || object.instance.readyState == 4) {
                    instance = object.instance;
                }
                getOne = true;
                break;
            }
        }
        if (!getOne) //对象不在缓存中，则创建  
        {
            object = new HttpRequestObject();
            object.chunnel = _chunnel;
            object.instance = this.createInstance();
            this.httpRequestCache.push(object);
            instance = object.instance;
        }
        return instance;
    }

    /**  
    * 客户端向服务端发送请求  
    * @param _url:请求目的  
    * @param _data:要发送的数据  
    * @param _processRequest:用于处理返回结果的函数，其定义可以在别的地方，需要有一个参数，即要处理的通信对象  
    * @param _chunnel:通道名称，默认为"default"  
    * @param _asynchronous:是否异步处理，默认为true,即异步处理
    * @param _paraObj:相关的参数对象 
    */
    this.send = function (_url, _data, _processRequest, _chunnel, _asynchronous, _paraObj) {
        if (_url.length == 0 || _url.indexOf("?") == 0) {
            alert("由于目的为空，请求失败，请检查！");
            return;
        }
        if (_chunnel == undefined || _chunnel == "") {
            _chunnel = "default";
        }
        if (_asynchronous == undefined) {
            _asynchronous = true;
        }
        var instance = this.getInstance(_chunnel);
        if (instance == null) {
            alert("浏览器不支持ajax，请检查！")
            return;
        }
        if (_asynchronous == true && typeof (_processRequest) == "function") {
            instance.onreadystatechange = function () {
                if (instance.readyState == 4) // 判断对象状态  
                {
                    if (instance.status == 200) // 信息已经成功返回，开始处理信息  
                    {
                        
                        _processRequest(instance, _paraObj);
                    }
                    else {
                        alert("您所请求的页面有异常，请检查！");
                    }
                }
            }
        }
        //_url加一个时刻改变的参数，防止由于被浏览器缓存后同样的请求不向服务器发送请求  
        if (_url.indexOf("?") != -1) {
            _url += "&requestTime=" + (new Date()).getTime();
        }
        else {
            _url += "?requestTime=" + (new Date()).getTime();
        }
        if (_data.length == 0) {
            instance.open("GET", _url, _asynchronous);
            instance.send(null);
        }
        else {
            instance.open("POST", _url, _asynchronous);
            instance.setRequestHeader("Content-Length", _data.length);
            instance.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            instance.send(_data);
        }
        if (_asynchronous == false && typeof (_processRequest) == "function") {
            if(instance.status != 200){
                  return console.log(instance.responseURL +" is "+instance.statusText);
            }
           
           _processRequest(instance, _paraObj);
        }
    }
}

function Env(fileset) {
    this.needLoadObject = new Array();
    
    //获取env.js文件所在路径 
    this.envPath = null;
    this.envPath ="http://" + window.location.host;
    
    this.fileSet = fileset;
    

    //获取文件后缀名
    this.getFileExt = function (fileUrl) {
        var d = /\.[^\.]+$/.exec(fileUrl);
        return d.toString().toLowerCase();
    }

    //依次放入要载入的文件
    this.pushNeedLoad = function (moduleName,version,url,index) {
        var _absUrl = null;
        if (url.charAt(0) == '/')
            _absUrl = url;
        else
            _absUrl = this.envPath + url;

        var object = new HttpGetObject();
        object.url = _absUrl;
        object.cache_key = moduleName;    //模块名
        object.chunnel = 'ch' + (this.needLoadObject.length + 1);
        object.type = this.getFileExt(_absUrl);
        object.version = version;
        object.index = index;
        //尝试从缓存获取 (version)
         
        var cacheContentVsersion = localStorage.getItem(object.cache_key);
        if (cacheContentVsersion) { 
             if(cacheContentVsersion == object.version){
                 var cacheContent = localStorage.getItem(object.cache_key+"?version="+object.version+"_"+object.index);
                 if(cacheContent){
                     object.is_fill = true; // 是否需要请求加载
                 }
             }else{
                 
                 localStorage.removeItem(object.cache_key);
                 var module = this.fileSet[object.cache_key];
                 for(var i=0;i<module.length;i++){
                  localStorage.removeItem(object.cache_key+"?version="+cacheContentVsersion+"_"+i);
                 }
             }
            
        }

        this.needLoadObject.push(object);
        return this;
    }

    //依次装载要处理的文件
    this.batchLoad = function () {
        for (var i = 0; i < this.needLoadObject.length; i++) {
            var item = this.needLoadObject[i];
            var processGet = function (_instance, _paraObj) {
                //console.log(_instance);
               // console.log(_paraObj);
                localStorage.setItem(_paraObj.cache_key,_paraObj.version);    //缓存文件
                localStorage.setItem(_paraObj.cache_key+"?version="+_paraObj.version+"_"+_paraObj.index, _instance.responseText);    //缓存文件
                _paraObj.is_fill = true;
            }
            if (item.is_fill == false) {
                Request.send(item.url, "", processGet, item.chunnel, false, item);  //采用同步方式载入
            }
        }
        return this;
    }

    //依次执行要处理的文件
    this.batchExec = function () {
        var runCss = function (_css) { document.write('<style type="text/css">' + _css + '</style>'); }
        var runJs = function (_js) {
            if (window.execScript)
                window.execScript(_js);
            else
                window.eval(_js);
        }
        //依次执行，由于js为单线程执行，每执行一个js都会阻塞其它，所以可以保证顺序执行
        for (var i = 0; i < this.needLoadObject.length; i++) {
            var item = this.needLoadObject[i];
            if (item.is_exec == false) {
                 // console.log(item)
                if (item.type == '.js') {
                    runJs(localStorage.getItem(item.cache_key+"?version="+item.version+"_"+item.index));
                    item.is_exec = true;  //标记已执行，下次不会再执行
                }
                else if (item.type == '.css') {
                    runCss(localStorage.getItem(item.cache_key+"?version="+item.version+"_"+item.index));
                    item.is_exec = true;  //标记已执行，下次不会再执行
                }
            }
        }
    }
    this.checkVersion = function(){
        var localVersion = localStorage.getItem("version");
        if(localVersion && localVersion == envLastVer){
        return
        }
        localStorage.clear();
        localStorage.setItem("version",envLastVer);
    };
    return this.checkVersion();
}

 
(function(win){
    var times = new Date();
    times = times.getDate();
        var fileMap = win.fileMap,
            needLoadModuleName = fileMap.getNeedLoadModuleName(),
            moduleVersionSet = fileMap.getVersion(),
            needLoadFile = fileMap.getNeedLoadFileSet();
     var env = new Env(needLoadFile);
        for(var index in needLoadModuleName){
            var moduleName = needLoadModuleName[index];
            var moduleVersion = moduleVersionSet[moduleName];
            var item = needLoadFile[moduleName];
            
            for(var index2 in item){
                env.pushNeedLoad(moduleName,moduleVersion,item[index2],index2);
            }
        }
        
    env.batchLoad().batchExec();
    var newtime = new Date()
    newtime = newtime.getDate()
    
    console.log(times - newtime)
    
})(window)