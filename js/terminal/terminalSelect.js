/**
 * Created by june on 16/8/8.
 */

function getStores(){
    let companyId = $('#tsPartionCompany_select').combobox('getValue');
    console.log(companyId);
    $.ajax({
        crossDomain: true,
        url: "http://115.159.142.32:20002/store",
        type: 'GET',
        contentType:"application/json",
        data: {
            companyCode:companyId
        },
        success: function (res) {
            console.log(res);
            if(res.statusCode === 100){
                // res = JSON.stringify(res);
                let data = res.stores;
                let stores = [];
                for(let i in data){
                    if(data[i].CompanyCode === companyId){
                        stores.push({ "text": data[i].StoreName, "id": data[i].StoreID });
                    }
                }
                $("#tsStore_select").combobox('loadData', stores);
            }
            else{
                alert(res.msg);
            }
        },
        error: function (res) {
            console.log(res);
        }
    });
}

function ts_reset(){
    $('#tsPartionCompany_select').combobox('setValue',"");
    $('#tsStore_select').combobox('setValue',"");
    $('#tsTerminalType_select').combobox('setValue',"");
    $('#tsType_select').combobox('setValue',"");
    $('#tsTerminalName_input').textbox('setValue',"");
    $('#tsTerminalNo_input').textbox('setValue',"");
    $('#tsLagerMemoryUseRate').textbox('setValue',"");
    $('#tsSmallerMemoryUseRate').textbox('setValue',"");
    $('#tsLagerCPUUseRate').textbox('setValue',"");
    $('#tsSmallerCPUUseRate').textbox('setValue',"");
    $('#tsLagerDiskUseRate').textbox('setValue',"");
    $('#tsSmallerDiskUseRate').textbox('setValue',"");
}

function ts_searchTerminal(){

    let grid = $('#selectTerminalTable');
    let options = grid.datagrid('getPager').data("pagination").options;

    let pageIndex = parseInt(options.pageNumber)-1;
    let pageSize = parseInt(options.pageSize);

    let componayCode = $('#tsPartionCompany_select').combobox('getValue');
    let storeId = $('#tsStore_select').combobox('getValue');
    let posType = $('#tsTerminalType_select').combobox('getValue');
    let state = $('#tsType_select').combobox('getValue');
    let postName = $('#tsTerminalName_input').textbox('getValue');
    let posId = $('#tsTerminalNo_input').textbox('getValue');
    let memoryUsedBegin = $('#tsLagerMemoryUseRate').textbox('getValue');
    let memoryUsedEnd = $('#tsSmallerMemoryUseRate').textbox('getValue');
    let cpuUsedBegin = $('#tsLagerCPUUseRate').textbox('getValue');
    let cpuUsedEnd = $('#tsSmallerCPUUseRate').textbox('getValue');
    let diskUsedBegin = $('#tsLagerDiskUseRate').textbox('getValue');
    let diskUsedEnd = $('#tsSmallerDiskUseRate').textbox('getValue');

    let reqDate = {
        pageIndex:pageIndex,
        pageSize:pageSize,
        companyCode:componayCode,
        storeId:storeId,
        posType:posType,
        state:state,
        postName:postName,
        posId:posId,
        memoryUsedBegin:memoryUsedBegin,
        memoryUsedEnd:memoryUsedEnd,
        cpuUsedBegin:cpuUsedBegin,
        cpuUsedEnd:cpuUsedEnd,
        diskUsedBegin:diskUsedBegin,
        diskUsedEnd:diskUsedEnd
    }

    $.ajax({
        crossDomain: true,
        url: "http://115.159.142.32:20002/pos",
        type: 'POST',
        contentType:"application/json",
        data: JSON.stringify(reqDate),
        success: function (res) {
            console.log(res);
            if(res.statusCode === 100){
                let listData = res.data.rows;
                let listDatas = new Array();
                for ( let i=0;i<parseInt(res.data.total);i++) {
                    selectTerminals[ID] = listData[i];
                    let rowData =  {
                        'tkNo':listData[i].ID,
                        //'tmName' : listData[i].ID,
                        'tmNum' : listData[i].PosID,
                        //'tmCompany' : listData[i].StartTime,
                        'tmStore' : listData[i].StoreName,
                        'tmState':listData[i].Status,
                        'tmMemusedRate' : listData[i].MemoryUsed,
                        'tmCPUuserRate' : listData[i].CPULoad,
                        'tmDiskuserRate' : listData[i].DiskUsed,//??
                        //'tmDiskNum' : listData[i].Status
                    };
                    listDatas.push(rowData);
                }
                $('#selectTerminalTable').datagrid('loadData',listDatas);

            }
            else{
                alert(res.msg);
            }
        },
        error: function (res) {
            console.log(res);
        }
    });
}

function  ts_searchTerminal_sure(){
    let teRows = $('#selectTerminalTable').datagrid('getChecked');
    let data = [];
    let names = "";
    for(let i in teRows){
        data.push({"StoreID":selectTerminals[teRows.tkNo].storeId,"PosID":teRows.tmNum})
        names+=teRows.tmName;
        names+=",";
    }
    names = names.substr(0,names.length-1);

    $('#terminalupdate_select').searchbox('setValue',names);

    selectTerminals = data;
    $('#selectTerminalDialog').window('close');
}