<template>
    <div>
        <!--     药品添加、修改弹出框       -->
        <div>
            <el-dialog title="药品添加/修改" :visible.sync="dialogFormVisible">
                <el-form :model="medicineform">
                    <el-form-item label="表单功能">
                        <el-input style="margin-left: 14px" v-model="insertorCreate" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="药品名称">
                        <el-input style="margin-left: 14px" v-model="medicineform.medicinename"
                                  autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="制造商名称">
                        <el-input v-model="medicineform.manufacturername" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="药品单价" :label-width="200">
                        <el-input-number style="margin-left: 14px" v-model="medicineform.purchaseprice"
                                         auto-complete="off"></el-input-number>
                    </el-form-item>
                    <el-form-item label="药品储量">
                        <el-input-number style="margin-left: 14px" v-model="medicineform.storagenum"
                                         auto-complete="off"></el-input-number>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogFormVisible = false">取 消</el-button>
                    <el-button type="primary" @click=insertMedicine>确 定</el-button>
                </div>
            </el-dialog>
        </div>
        <!--     药品库存列表       -->
        <div>
            <el-table border
                    :data="medicineTable">
                <el-table-column
                        prop="medicinenum"
                        label="药品编号">
                </el-table-column>
                <el-table-column
                        prop="medicinename"
                        label="药品名">
                </el-table-column>
                <el-table-column
                        prop="manufacturername"
                        label="制造商">
                </el-table-column>
                <el-table-column
                        prop="storagedate"
                        label="入库日期">
                </el-table-column>
                <el-table-column
                        prop="purchaseprice"
                        label="药品单价">
                </el-table-column>
                <el-table-column
                        prop="storagenum"
                        label="库存量">
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button
                                size="mini"
                                @click="handleEdit(scope.$index,scope.row)">编辑
                        </el-button>
                        <el-button
                                size="mini"
                                type="danger"
                                @click="handleDelete(scope.$index,scope.row)">删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-button @click=addMedicine type="primary" style="margin-top: 10px">添加药品信息</el-button>
        </div>
    </div>
</template>

<script>
    import qs from 'qs'

    export default {
        name: "StorageInfo",
        data() {
            return {
                medicineTable: [],
                medicineform: {
                    manufacturername: "",
                    medicinename: "",
                    medicinenum: 0,
                    purchaseprice: 0,
                    storagedate: "",
                    storagenum: 0
                },
                dialogFormVisible: false,
                insertorCreate: true,
            }
        },
        mounted() {
            this.checkId()
            this.loadStorageInfo()
        },
        methods: {
            checkId() {
                var uid = window.sessionStorage.getItem("userIdentity");
                if (uid != 1 && uid != 2) {
                    this.$router.replace("/home");
                    this.$message.error("权限不足");
                }
            },
            loadStorageInfo() {
                this.$http.get('/medicinetable/medicineInfo').then(resp => {
                    this.medicineTable = resp
                })
            },
            handleEdit(index, row) {
                this.dialogFormVisible = true;
                this.insertorCreate = false;
                this.medicineform = row;
            },
            handleDelete(index, row) {
                const data = {
                    medicinenum: row.medicinenum
                }
                this.$http.post('/medicinetable/deleteMedicine', qs.stringify(data)).then(resp => {
                });
                this.$router.go(0);
            },
            insertMedicine() {
                if (this.insertorCreate) {
                    this.$http({
                        url: '/medicinetable/addMedicine',
                        method: 'post',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        data: this.medicineform
                    }).then(resp => {

                    });
                } else {
                    this.$http({
                        url: '/medicinetable/changeMedicine',
                        method: 'post',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        data: this.medicineform
                    }).then(resp => {

                    });
                }
                this.$router.go(0);
            },
            addMedicine() {
                this.dialogFormVisible = true;
                this.insertorCreate = true;
            }
        }
    }
</script>

<style scoped>

</style>