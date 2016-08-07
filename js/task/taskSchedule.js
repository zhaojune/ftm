/**
 * Created by june on 16/8/8.
 */

function getsch_Stores(){
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
                $("#scheduleStore_select").combobox('loadData', stores);
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

function sch_searchTerminal(){

    let grid = $('#schedule_list_data');
    let options = grid.datagrid('getPager').data("pagination").options;

    let pageIndex = parseInt(options.pageNumber)-1;
    let pageSize = parseInt(options.pageSize);

    let componayCode = $('#schedulePartionCompany_select').combobox('getValue');
    let storeId = $('#scheduleStore_select').combobox('getValue');
    let posType = $('#scheduleTerminalType_select').combobox('getValue');

    let state = $('#resultTabs').tabs('getSelected').panel('options').title;

    let postName = $('#scheduleTerminalName_input').textbox('getValue');
    let posId = $('#scheduleTerminalNo_input').textbox('getValue');

    let reqDate = {
        pageIndex:pageIndex,
        pageSize:pageSize,
        companyCode:componayCode,
        storeId:storeId,
        posType:posType,
        state:state,
        postName:postName,
        posId:posId
    };

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
                        //'terminalName' : listData[i].ID,
                        'terminalNo' : listData[i].PosID,
                        'terminalType':listData[i].Type,
                        //'partionCompanies' : listData[i].StartTime,
                        'stores' : listData[i].StoreName,
                        'np6' : listData[i].Np6Version,
                        'np6App' : listData[i].Np6ExeVersion,
                        'sokPic' : listData[i].SOKPicVer,//??
                        'ownSoftware' : listData[i].SelfSoft,
                        'keyPos' : listData[i].ForkVersion
                        //'failLog'
                    };
                    listDatas.push(rowData);
                }
                $('#schedule_list_data').datagrid('loadData',listDatas);

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
