/**
 * Created by june on 16/8/8.
 */

function getinfo_Stores(){
    let companyId = $('#infoPartionCompany_select').combobox('getValue');
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
                        stores.push({ "text": data[i].StoreName, "value": data[i].StoreID });
                    }
                }
                $("#infoStore_select").combobox('loadData', stores);
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

function info_reset(){
    $('#infoPartionCompany_select').combobox('setValue',"");
    $('#infoStore_select').combobox('setValue',"");
    $('#infoTerminalType_select').combobox('setValue',"");
    $('#infoType_select').combobox('setValue',"");
    $('#infoTerminalName_input').textbox('setValue',"");
    $('#infoTerminalNo_input').textbox('setValue',"");
    $('#infoLagerMemoryUseRate').textbox('setValue',"");
    $('#infoSmallerMemoryUseRate').textbox('setValue',"");
    $('#infoLagerCPUUseRate').textbox('setValue',"");
    $('#infoSmallerCPUUseRate').textbox('setValue',"");
    $('#infoLagerDiskUseRate').textbox('setValue',"");
    $('#infoSmallerDiskUseRate').textbox('setValue',"");
}

function searchTerminal(){

    let grid = $('#terminalInfoTable');
    let options = grid.datagrid('getPager').data("pagination").options;

    let pageIndex = parseInt(options.pageNumber)-1;
    let pageSize = parseInt(options.pageSize);

    let componayCode = $('#infoPartionCompany_select').combobox('getValue');
    let storeId = $('#infoStore_select').combobox('getValue');
    let posType = $('#infoTerminalType_select').combobox('getValue');
    let state = $('#infoType_select').combobox('getValue');
    let postName = $('#infoTerminalName_input').textbox('getValue');
    let posId = $('#infoTerminalNo_input').textbox('getValue');
    let memoryUsedBegin = $('#infoLagerMemoryUseRate').textbox('getValue');
    let memoryUsedEnd = $('#infoSmallerMemoryUseRate').textbox('getValue');
    let cpuUsedBegin = $('#infoLagerCPUUseRate').textbox('getValue');
    let cpuUsedEnd = $('#infoSmallerCPUUseRate').textbox('getValue');
    let diskUsedBegin = $('#infoLagerDiskUseRate').textbox('getValue');
    let diskUsedEnd = $('#infoSmallerDiskUseRate').textbox('getValue');

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
                    let rowData =  {
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

                $('#terminalInfoTable').datagrid('loadData',listDatas);

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
