/**
 * Created by june on 16/8/5.
 */

let tasklist = {};
let isUpdate = false;
let currTaskID = "";
let updateTask = {};
let selectTerminals = {};

//任务列表搜索
function taskListSearch(){
    //获取查询条件
    let grid = $('#taskList');
    let options = grid.datagrid('getPager').data("pagination").options;

    let pageIndex = parseInt(options.pageNumber)-1;
    if(pageIndex === -1){
        pageIndex++;
    }
    let pageSize = parseInt(options.pageSize);
    let taskName = handleNullInfo($('#taskListSearchName_input').textbox('getValue'));
    let beginDate = handleNullInfo($('#taskListSearchStartTime_input').datetimebox('getValue'));
    let endDate = handleNullInfo($('#taskListSearchEndTime_input').datetimebox('getValue'));
    let taskState = handleNullNum($('#taskListSearchState_input').combobox('getValue'));

    if(beginDate&&endDate&&$('#taskListSearchStartTime_input').datetimebox('getValue')>$('#taskListSearchEndTime_input').datetimebox('getValue')){
        alert("开始时间大于结束时间");
        return;
    }

    //let taskStateJson="/scripts/area/areas.json";
    //$.getJSON(taskStateJson, function(data){
    //    for(let i in taskStateJson){
    //        if(taskStateJson[i].text === taskState){
    //            taskState = parseInt(taskStateJson[i].id);
    //        }
    //    }
    //});

    //构造查询数据
    let requestData = {
        pageIndex:pageIndex,
        pageSize:pageSize,
        taskName:taskName,
        beginDate:beginDate,
        endDate:endDate,
        taskState:taskState
    };

    jQuery.support.cors = true;
    $.ajax({
        crossDomain: true,
        url: "http://115.159.142.32:20002/querytask",
        type: 'POST',
        contentType:"application/json",
        data: JSON.stringify(requestData),
        success: function (res) {
            if(res.status_code === 100){

                console.log(requestData);
                console.log(res);
                let listData = res.data.rows;

                let listDatas = new Array();
                for ( let i=0;i<listData.length;i++) {
                    let schedule = "";

                    let taskStateJson="../json/task/taskState.json";
                    $.getJSON(taskStateJson, function(data){

                        for(let i in data){
                            if(data[i].id === listData[i].Status){
                                schedule = data[i].text;
                            }
                        }
                    });

                    let rowData =  {
                        'tkNum' : listData[i].ID,
                        'tkName' : listData[i].Name,
                        'tkStartTime' : listData[i].StartTime,
                        'tkEndTime' : listData[i].EndTime,
                        'tkCreator':listData[i].EditUser,
                        'tkCreateTime' : listData[i].CreateDate,
                        'tkSchedule' : schedule
                    };
                    listDatas.push(rowData);
                }
                listDatas.sort(function(a,b) {
                    if(a.ID< b.ID)
                        return -1;
                    else if(a.ID> b.ID){
                        return 1;
                    }
                    else{
                        return 0;
                    }
                });
                $('#taskList').datagrid('loadData',listDatas);

                let p = $('#taskList').datagrid('getPager');
                $(p).pagination({
                    displayMsg: '共 '+res.data.total+' 条记录'
                });
            }
            else{
                alert(res.msg);
            }
        },
        error: function (res) {
            console.log(res);
            alert(res);
        }
    });
}

//链接跳转
function taskListbtnJump(title,url,id){
    currTaskID = id;

    if(title === "任务修改"){
        isUpdate = true;
        if($('#tabs').tabs('exists',"任务添加")){
            let tab = $('#tabs').tabs('getTab',"任务添加");
            if(tab){
                let index = $('#tabs').tabs('getTabIndex',tab);
                $('#tabs').tabs('close',index);
            }
        }
    }
    else if(title === "任务添加"){
        isUpdate = false;
        if($('#tabs').tabs('exists',"任务修改")){
            let tab = $('#tabs').tabs('getTab',"任务修改");
            if(tab){
                let index = $('#tabs').tabs('getTabIndex',tab);
                $('#tabs').tabs('close',index);
            }
        }
    }

    if($('#tabs').tabs('exists',title)){
        let tab = $('#tabs').tabs('getTab',title);
        if(tab){
            let index = $('#tabs').tabs('getTabIndex',tab);
            $('#tabs').tabs('close',index);
        }
    }
    $('#tabs').tabs('add', {
        title:  title,
        href: url,
        closable: true
    });

}

function dateFormatter(date) {
    date = new Date(date)
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    var d = date.getDate();
    var h = date.getHours();
    var min = date.getMinutes();
    var sec = date.getSeconds();
    var day = y + '-' + (m < 10 ? ('0' + m) : m) + '-' + (d < 10 ? ('0' + d) : d) + " " +
        (h < 10 ? ('0' + h) : h) + ":" + (min < 10 ? ('0' + min) : min) + ":" + (sec < 10 ? ('0' + sec) : sec);
    return day;
}

function handleNullInfo(info){
    if(!info){
        return null;
    }
    if(info.replace(/\s/g, "") === "" || info.replace(/\s/g, "") === "全选"){
        return null;
    }
    else{
        return info;
    }
}

function  handleNullNum(num){
    if(!num || parseInt(num) === -2){
        return null;
    }
    else{
        return parseInt(num);
    }
}

function  handleNullFloat(num){
    if(!num){
        return null;
    }
    else{
        console.log(parseFloat(num)*0.01);
        return parseFloat(num)*0.01;
    }
}


