<template>
    <!--     库存预警列表       -->
    <div>
        <el-button type="primary" @click="generateOrderForm">生成订货单</el-button>
        <el-table border
                  :row-class-name="tableRowClassName"
                  :data="alarmStorage">
            <el-table-column
                    prop="medicineName"
                    label="药品名">
            </el-table-column>
            <el-table-column
                    prop="alarmStorageNum"
                    label="库存预警量">
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button
                            size="mini"
                            @click="handleEdit(scope.$index,scope.row)">编辑
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
    import qs from 'qs'
    export default {
        name: "AlarmInfo",
        data() {
            return {
                alarmStorage: [],
            }
        },
        mounted: function () {
            this.checkId()
            this.loadAlarmStorage()
        },
        methods: {
            tableRowClassName({row, rowIndex}) {
                if (row.storageState) {
                    return 'success-row';
                } else {
                    return 'warning-row';
                }
            },
            checkId() {
                var uid = window.sessionStorage.getItem("userIdentity");
                if (uid != 1 && uid != 3) {
                    this.$router.replace("/home");
                    this.$message.error("权限不足");
                }
            },
            loadAlarmStorage() {
                this.$http.get('/alarmtable/alarmInfo').then(resp => {
                    this.alarmStorage = resp;
                })

            },
            handleEdit(index, row) {
                this.$prompt('请输入新的库存预警量', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                }).then(({value}) => {
                    this.$http({
                        url: '/alarmtable/changeAlarmStorage',
                        method: 'post',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        data: {
                            medicinenum: index + 1,
                            alarmstoragenum: value
                        }
                    }).then(resp => {
                        if (resp.status === 200) {
                            this.$message.success(resp.data);
                        } else {
                            this.$message.error(resp.data);
                        }
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '取消输入'
                    });
                });
            },
            generateOrderForm() {
                const data = {token:window.sessionStorage.getItem('tokenStr')}
                this.$http.post('/alarmtable/generateOrderDoc',qs.stringify(data)).then(resp=>{
                    if (resp.status === 200) {
                        this.$message.success(resp.data);
                    } else {
                        this.$message.error(resp.data);
                    }
                })
            }
        }
    }
</script>

<style>
    .el-table .warning-row {
        background: oldlace;
    }

    .el-table .success-row {
        background: #f0f9eb;
    }
</style>