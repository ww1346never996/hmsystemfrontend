<template>
    <div>
        <div>
            <el-dialog title="药品清单" :visible.sync="dialogTableVisible">
                <el-table border
                        :data="dialogData">
                    <el-table-column
                            prop="medicineName"
                            label="药品名称">
                    </el-table-column>
                    <el-table-column
                            prop="medicinePrice"
                            label="药品单价">
                    </el-table-column>
                    <el-table-column
                            prop="storageNumber"
                            label="订货数量">
                    </el-table-column>
                </el-table>
            </el-dialog>
        </div>
        <div>
            <el-table border
                    :data="rationList">
                <el-table-column
                        prop="departmentNum"
                        label="部门编号">
                </el-table-column>
                <el-table-column
                        prop="departmentName"
                        label="部门">
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="primary" size="mini" @click="showDialog(scope.row)">查看详情</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
    export default {
        name: "RationInfo",
        data() {
            return {
                rationList: [],
                medicineInfo: [],
                subData: [],
                dialogData: [],
                dialogTableVisible: false
            }
        },
        mounted() {
            this.checkId()
            this.loadRation()
        },
        methods: {
            checkId() {
                var uid = window.sessionStorage.getItem("userIdentity");
                if (uid != 1 && uid != 2) {
                    this.$router.replace("/home");
                    this.$message.error("权限不足");
                }
            },
            loadRation() {
                this.$http.get('/ration/getRationList').then(resp => {
                    this.rationList = resp
                });
                this.$http.get('/medicinetable/medicineInfo').then(resp => {
                    this.medicineInfo = resp
                })
            },
            showDialog(row) {
                this.subData = row;
                this.dialogData = row.medicineList;
                this.dialogTableVisible = true;
            },
        }
    }
</script>

<style scoped>

</style>