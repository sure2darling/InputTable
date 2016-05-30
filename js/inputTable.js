var  bufferTr=new Object();

(function($){
    jQuery.fn.extend({

        "getTableData":function(){
            var datatable = '[';
            this.find("tbody>tr").each(function (i,tr) {
                var dataInput = '{';
                $(tr).find("input[type='text']").each(function (i,input) {
                    var name=$(input).attr('name');
                    var val=$(input).val();
                    dataInput += '"' + name + '":"' + val + '",'
                });
                if (dataInput.lastIndexOf(",")) {
                    dataInput = dataInput.substring(0, dataInput.length - 1);
                    dataInput += '}';
                }
                datatable += dataInput + ',';
            });
            if (datatable.lastIndexOf(",")) {
                datatable = datatable.substring(0, datatable.length - 1);
                datatable += ']';
            }
            return datatable;
        },


        "putModifyData":function(data){
            if(data.length < 1) {
                return false
            }
            var compModifyColum='<tr>';
            for (var i = 0; i < data.length;i++){
                $.each(data[i],function(i,n){
                    if(i!=="state"){
                        compModifyColum +='<td class="nopadding"><input type="text" maxlength="40" name='+i+' value='+n+' /></td>';
                    }
                });
                compModifyColum +='</tr>';
            }
            //alert(compModifyColum);
            this.children("tbody").append(compModifyColum);
        },


        "deletCheckedColum":function(note){
            var checkd=this.children("tbody").find("input[type='checkbox']:checked");
            var flag=true;
            if(checkd.length<1){
                alert("请选择要删除的对象");
                flag= false;
            }else{
                if(note=="note"){
                    if (confirm("确认要删除选择对象?")   ){
                        flag=true;
                        checkd.each(function(i,check){
                            $(check).parents("tr").remove();
                        });
                    }else{
                        flag=false;}
                }else{
                    checkd.each(function(i,check){
                        $(check).parents("tr").remove();
                    });
                }
            }
            return flag;
        },


        "inputTable":function(option){
    //   debugger;
    //-------------------------------------------------------------------------------------------------
    if (option.constructor.toString().indexOf("Object") > -1) {
        var defaultN={
            method:"add,modify",
            data:data,
            columns:[
                {
                    checkbox:false,
                    title:"",
                    field:"",
                    value:"",
                    select:"",
                    //select:[
                    //    {
                    //        value:"",
                    //        text:"",
                    //        attr:[{
                    //              }]
                    //    }],
                    visible:true,
                    attr:[{
                        name:"onfocus",
                        value:"eeeee()"
                    }]
                }]
        };
        // debugger;
        var thead = '<thead><tr>';
        var tbodyTr = "";
        var tbodyTdCheckBox='';
        var tbodyThCheckBox='';
        var columns = option.columns;
        var colNo = option.columns.length;
        var colIndex = 0;
        var colVisible =[];


//option
        function optionBuil(select,selectedVal){
            var optionBuil;
            $.each(select,function(i,n){
                optionBuil+='<option value="'+n.value+'"'+selected(n.value)+addAttr(n.attr)+'>'+n.text+'</option>';
            });
            function selected(val){
                if(val==selectedVal){
                    return "selected";
                }else{
                    return ""
                }
            }
            return optionBuil;
        }

        //thead
        function theadBuil(columns){

        }
        //visible
        function visible(visible){
//                  debugger;
            if((typeof visible).indexOf("boolean")>-1){
                var stle="";
                if(!visible){
                    stle='style="display:none"';
                }else{
                    stle="";
                }
                return stle;
            }
        }
//attr
        function addAttr(attrArray){
            //                debugger;
            if((typeof attrArray).indexOf("object")>-1){
                var inputFun="";
                if(attrArray!=""){
                    $.each(attrArray,function(i,n){
                        var name=n.name;
                        var value=n.value;
                        inputFun+=name+'="'+value+'" ';
                    });
                }else{
                    inputFun=""
                }
                return inputFun;
            }
        }
//input
        function inputBuild(name,value,atrribute){
            if(typeof value=="undefined"){
                value="";
            }
            var input='<input maxlength="50" type="text" '+ addAttr(atrribute)+' value="'+value+'" name="'+ name +'"/>';
            return input;
        }

//columns有checkbox
        if ((typeof columns[0].checkbox).indexOf("boolean")>-1) {
            colIndex = 1;
            if(columns[0].checkbox){
                tbodyTdCheckBox = '<td><input type="checkbox" name="CheckOne"/></td>';
                tbodyThCheckBox = '<th><input type="checkbox" name="CheckAll"/></th>'
            }
        }

        if (option.method === "add") {
            thead+=tbodyThCheckBox;
            tbodyTr+='<tr>'+tbodyTdCheckBox;
//debugger;
            for (i=colIndex; i < colNo; i++) {
                var select=columns[i].select;
                thead += '<th '+visible(columns[i].visible)+'>' + columns[i].title + '</th>';
                if(select){
                    tbodyTr +='<td class="nopadding" ><select name="'+ columns[i].field+'">'+optionBuil(select)+'</select></td>';
                }else{
                    tbodyTr +='<td class="nopadding" '+visible(columns[i].visible)+'>'+inputBuild(columns[i].field,columns[i].value,columns[i].attr)+'</td>';
                }
            }

            thead += '</tr></thead>';
            tbodyTr += "</tr>";
            bufferTr[this.prop("id")] = tbodyTr;
            var table = thead + '<tbody>' + tbodyTr + '</tbody>';
            this.append(table);
            return null;
        }

        if (option.method === "modify") {
//                  debugger;
            var data = option.data;
            //                  console.log(JSON.stringify(data));
            thead+=tbodyThCheckBox;
            for (var i = colIndex; i < colNo; i++) {
                thead += '<th '+visible(columns[i].visible)+'>' + columns[i].title + '</th>';
            }
            thead += '</tr></thead>';

            for (var i = 0; i < data.length; i++) {
                tbodyTr +='<tr>'+tbodyTdCheckBox;
                for (var j = colIndex; j < colNo; j++) {

                    var value = data[i][columns[j].field];
                    var select=columns[j].select;
                    var name = columns[j].field;

                    if(select){
                        tbodyTr +='<td class="nopadding" ><select name="'+ columns[j].field+'">'+optionBuil(select,value)+'</select></td>';
                    }else{
                        tbodyTr += '<td class="nopadding" '+visible(columns[j].visible)+'>'+inputBuild(name,value,columns[j].attr)+'</td>';
                    }
                }
                tbodyTr += '</tr>';
            }
            var table = thead + '<tbody>' + tbodyTr + '</tbody>';
            this.append(table);
            return null;
        }


    }

    //---------------------------------------------------------------------------------------------------
    if(option.constructor.toString().indexOf("String")>-1){
        if(option==="destroy"){
            this.children("tbody,thead").remove();
            return this;
        }else if(option==="addColumn"){
            this.children("tbody").append( bufferTr[this.prop("id")]);
            return null;
        }else if(option==="getAllData"){
            var datatable = '[';
            this.find("tbody>tr").each(function (i,tr) {
                var dataInput = '{';
                $(tr).find("input[type='text'],select").each(function (i,input) {
                    var name=$(input).attr('name');
                    var val=$(input).val();
                    dataInput += '"' + name + '":"' + val + '",'
                });
                if (dataInput.lastIndexOf(",")) {
                    dataInput = dataInput.substring(0, dataInput.length - 1);
                    dataInput += '}';
                }
                datatable += dataInput + ',';
            });
            if (datatable.lastIndexOf(",")) {
                datatable = datatable.substring(0, datatable.length - 1);
                datatable += ']';
            }
            return datatable;
        }
    }
}

});



})(jQuery);