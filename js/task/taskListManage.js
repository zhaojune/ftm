/**
 * Created by june on 16/8/5.
 */

let tasklist = {};
let isUpdate = false;
let currTask = {};
let updateTask = {};

//任务列表搜索
function taskListSearch(){

    //获取查询条件
    let grid = $('#taskList');
    let options = grid.datagrid('getPager').data("pagination").options;

    let pageIndex = parseInt(options.pageNumber)-1;
    let pageSize = parseInt(options.pageSize);
    let taskName = $('#taskListSearchName_input').val().replace(/\s/g, "");
    let beginDate = $('#taskListSearchStartTime_input').val();
    let endDate = $('#taskListSearchEndTime_input').val();
    let taskState = $('#taskListSearchState_input').combobox('getText').replace(/\s/g, "");

    console.log(beginDate);
    //处理查询条件
    if(taskName === ""){
        taskName = null;
    }
    if(taskState === ""){
        taskState = null;
    }


    //构造查询数据
    let requestData = {
        pageIndex:pageIndex,
        pageSize:pageSize,
        taskName:taskName,
        //beginDate:Date(),
        //endDate:Date(endDate),
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
            if(res.statusCode === 100){

                let listData = res.data.rows;

                let listDatas = new Array();
                for ( let i=0;i<parseInt(res.data.total);i++) {
                    tasklist[listData[i].ID] = listData[i];
                    let rowData =  {
                        'tkNum' : listData[i].ID,
                        'tkName' : listData[i].Name,
                        'tkStartTime' : listData[i].StartTime,
                        'tkEndTime' : listData[i].EndTime,
                        'tkCreator':listData[i].EditUser,
                        'tkCreateTime' : listData[i].CreateDate,
                        'tkSchedule' : listData[i].Status
                    };
                    listDatas.push(rowData);
                }

                $('#taskList').datagrid('loadData',listDatas);

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
    currTask = tasklist[id];
    console.log(id);
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

    console.log(currTask);
    if(title === "任务修改"){
        isUpdate = true;
    }
}