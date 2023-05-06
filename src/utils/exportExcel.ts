import * as XLSX from 'xlsx'
import swal from "sweetalert";

// 将 JSON 数据导出为 Excel 文件
export const exportJsonToExcel = (table_data: any) => {
    if(table_data.length==0){
        swal({
            title: "表格数据为空>_<",
            text: "请先检测文件",
            icon: "warning",
            buttons: {
                confirm: {
                    text: '确定',
                    value: true,
                },
            },
        })
        return
    }
    // 1. 创建一个 workbook
    const workbook = XLSX.utils.book_new();

    // 2. 将数据转换为工作簿中的工作表
    const sheet = XLSX.utils.json_to_sheet(table_data);

    // 3. 将工作表添加到工作簿中
    XLSX.utils.book_append_sheet(workbook, sheet, 'Sheet1');

    // 4. 将工作簿导出为 Excel 文件
    XLSX.writeFile(workbook, '检测结果.xlsx');
}