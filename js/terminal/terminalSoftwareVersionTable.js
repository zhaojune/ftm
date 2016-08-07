/**
 * Created by june on 16/8/8.
 */

function getsv_Stores(){
    let companyId = $('#partionCompany_select').combobox('getValue');
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
                $("#store_select").combobox('loadData', stores);
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

function sv_reset(){
    $('#partionCompany_select').combobox('setValue',"");
    $('#store_select').combobox('setValue',"");
    $('#terminalType_select').combobox('setValue',"");
    $('#type_select').combobox('setValue',"");
    $('#terminalName_input').textbox('setValue',"");
    $('#terminalNo_input').textbox('setValue',"");
    $('#NP6Version').combobox('setValue',"");
    $('#NP6APPVersion').combobox('setValue',"");
    $('#SOKPic').combobox('setValue',"");
    $('#Own').combobox('setValue',"");
    $('#KeyPos').combobox('setValue',"");
}

function sv_searchTerminal(){

    let grid = $('#sv_selectTerminalTable');
    let options = grid.datagrid('getPager').data("pagination").options;

    let pageIndex = parseInt(options.pageNumber)-1;
    let pageSize = parseInt(options.pageSize);

    let componayCode = $('#partionCompany_select').combobox('getValue');
    let storeId = $('#store_select').combobox('getValue');
    let posType = $('#terminalType_select').combobox('getValue');
    let state = $('#type_select').combobox('getValue');
    let postName = $('#terminalName_input').textbox('getValue');
    let posId = $('#terminalNo_input').textbox('getValue');
    let Np6Version = $('#NP6Version').textbox('getValue');
    let Np6ExeVersion = $('#NP6APPVersion').textbox('getValue');
    let SOKPicVer = $('#SOKPic').textbox('getValue');
    let SelfSoft = $('#Own').textbox('getValue');
    let ForkVersion = $('#KeyPos').textbox('getValue');


    let reqDate = {
        pageIndex:pageIndex,
        pageSize:pageSize,
        companyCode:componayCode,
        storeId:storeId,
        posType:posType,
        state:state,
        postName:postName,
        posId:posId,
        Np6Version:Np6Version,
        Np6ExeVersion:Np6ExeVersion,
        SOKPicVer:SOKPicVer,
        SelfSoft:SelfSoft,
        ForkVersion:ForkVersion
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
                    let rowData =  {
                        //'tmName' : listData[i].ID,
                        'tmNum' : listData[i].PosID,
                        //'tmCompany' : listData[i].StartTime,
                        'tmStore' : listData[i].StoreName,
                        'tmState':listData[i].Status,
                        'tmNP6' : listData[i].Np6Version,
                        'tmNP6APP' : listData[i].Np6ExeVersion,
                        'tmSOKPic' : listData[i].SOKPicVer,//??
                        'tmOwn' : listData[i].SelfSoft,
                        'tmKeyPos' : listData[i].ForkVersion
                    };
                    listDatas.push(rowData);
                }

                $('#sv_selectTerminalTable').datagrid('loadData',listDatas);

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

