/**
 * Created by june on 16/8/8.
 */


function selectTerminal(){
    $('#selectTerminalDialog').dialog({
        title:"",
        href:'./terminal/terminalSelect.html'
    });
    $('#selectTerminalDialog').window('open');
}

function add_reset(){
    $('#taskType_select').combobox('setValue',"");
    $('#taskName').textbox('setValue',"");
//        $('#startTime').datetimebox('setValue',Date());
//        $('#endTime').datetimebox('setValue',Date());
    $("input[name='strategy_radio']").eq(0).click();
    $('#updateFile_input').textbox('setValue',"");
}

function addOrUpdate(){
    let id = null;
    if(isUpdate){
        id = updateTask.ID;
    }

    let sty = "";
    switch ($("input[name='strategy_radio']:checked").val()){
        case "只执行一次":
            sty="O";
            break;
        case "每天执行一次":
            sty="D";
            break;
        case "每周执行一次":
            sty="W";
            break;
        case "每月执行一次":
            sty="M";
            break;
    }

    let reqTask = {
        ID:id,
        Name:$('#taskName').val(),
        Type:$('#taskType_select').combobox('getValue'),
        StartTime:$('#startTime').val(),
        EndTime:$('#endTime').val(),
        Strategy:sty,
        NeedRestart:parseInt($("input[name='ifrs']:checked").val()),
        FilePath:$('#updateFile_input').val(),
        Clients:selectTerminals
    };
    console.log(reqTask);


    $.ajax({
        crossDomain: true,
        url: "http://115.159.142.32:20002/task",
        type: 'POST',
        contentType:"application/json",
        data: JSON.stringify(reqTask),
        success: function (res) {
            if(res.statusCode === 100){
                if(isUpdate){
                    alert("修改成功");
                }
                else{
                    alert("添加成功");
                }
            }
            else{
                alert("操作失败了");
                console.log(res.statusCode);
            }
        },
        error: function (res) {
            console.log(res);
        }
    });

    $.ajax({
        crossDomain: true,
        url: "http://115.159.142.32:20002/upload",
        type: 'POST',
        contentType:"application/json",
        enctype:"multipart/form-data",
        data: $('#updateFileInfo').serialize(),
        success: function (res) {
            if(res.statusCode === 100){
                alert("文件上传成功");
            }
            else{
                alert("操作失败了");
                console.log(res.statusCode);
            }
        },
        error: function (res) {
            console.log(res);
        }
    });

}