<template>
    <div>
        <div>
            <!-- 搜索框 -->
            <el-input
                    style="width: 20%;margin-bottom: 20px"
                    type="text"
                    v-model="selectVal"
                    placeholder="搜索单据"
            ></el-input>
            <el-button style="margin-left: 10px" type="" @click="searchData">查找</el-button>
            <el-button style="margin-left: 10px" type="" @click="reset">取消</el-button>
        </div>
        <!--     添加出库单弹出框       -->
        <div>
            <el-dialog title="添加出库单" :visible.sync="dialogFormVisible">
                <el-select v-model="departmentNum" placeholder="请选择">
                    <el-option
                            v-for="item in rationList"
                            :key="item.departmentNum"
                            :label="item.departmentName"
                            :value="item.departmentNum">
                    </el-option>
                </el-select>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogFormVisible = false">取 消</el-button>
                    <el-button type="primary" @click=insertStorageOut>确 定</el-button>
                </div>
            </el-dialog>
        </div>
        <!--     药品清单弹出框       -->
        <div>
            <el-dialog title="药品清单" :visible.sync="dialogTableVisible">
                <el-table :data="dialogData">
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
                <el-table-column>
                </el-table-column>
                <el-select style="width: 33%" v-model="medicinenum" clearable placeholder="请选择添加的订单药品">
                    <el-option v-for="item in medicineInfo"
                               :key="item.medicinenum"
                               :label="item.medicinename"
                               :value="item.medicinenum">
                    </el-option>
                </el-select>
                <el-input style="width: 33%" v-model="medicinePrice" placeholder="请输入单价"></el-input>
                <el-input style="width: 20%" v-model="medicinenumber" placeholder="请输入数量"></el-input>
                <el-button type="primary" @click="addMedicineList">添加药品</el-button>
                <el-button type="primary" @click="changeOrder" style="margin-top: 20px;margin-left: 85%">修改订单信息
                </el-button>
            </el-dialog>
        </div>
        <!--     出库单列表       -->
        <div>
            <el-table :data="storageSearchData"
                      border
                      :row-class-name="tableRowClassName"
                      row-key="docNum">
                <el-table-column
                        prop="docNum"
                        label="单据编号">
                </el-table-column>
                <el-table-column
                        prop="docCreator"
                        label="负责人">
                </el-table-column>
                <el-table-column
                        prop="docCreateTime"
                        label="单据生成时间">
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="primary" size="mini" @click="showDialog(scope.row)">查看详情</el-button>
                        <el-button
                                size="mini"
                                type="success"
                                @click="completedOut(scope.$index,scope.row)">完成订单
                        </el-button>
                        <el-button
                                size="mini"
                                type="danger"
                                @click="handleDelete(scope.$index,scope.row)">删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-button @click="dialogFormVisible = true" type="primary" style="margin-top: 10px">添加出库单</el-button>
        </div>
    </div>
</template>

<script>
    import qs from "qs";

    export default {
        name: "StorageOut",
        data() {
            return {
                storageOutTable: [],
                medicineInfo: [],
                orderInfo: [],
                departmentNum: '',
                subData: [],
                dialogData: [],
                dialogTableVisible: false,
                dialogFormVisible: false,
                documentFormData: [],
                stateValue: '',
                medicinenum: '',
                medicinePrice: '',
                medicinenumber: '',
                medicineName: '',
                rationList: [],
                storageSearchData: [],
                selectVal: '',
            }
        },
        mounted() {
            this.checkId()
            this.loadStorageOut()
        },
        watch: {
            medicinenum(newValue, oldValue) {
                for (const item of this.medicineInfo) {
                    if (item.medicinenum === newValue) {
                        this.medicinePrice = item.purchaseprice;
                        this.medicineName = item.medicinename;
                    }
                }
            }
        },
        methods: {
            checkId() {
                var uid = window.sessionStorage.getItem("userIdentity");
                if (uid != 1 && uid != 2) {
                    this.$router.replace("/home");
                    this.$message.error("权限不足");
                }
            },
            loadStorageOut() {
                this.$http.get('/documenttable/getStorageOut').then(resp => {
                    this.storageOutTable = resp;
                    this.storageSearchData = resp;
                });
                this.$http.get('/medicinetable/medicineInfo').then(resp => {
                    this.medicineInfo = resp;
                });
                this.$http.get('/documenttable/getOrderDone').then(resp => {
                    this.orderInfo = resp;
                });
                this.$http.get('/ration/getRationList').then(resp => {
                    this.rationList = resp;
                })
            },
            searchData() {
                //并没有输入关键字时，就不要再搜索了
                if (this.selectVal === '' || this.selectVal == null) {
                    this.storageSearchData = JSON.parse(JSON.stringify(this.storageSearchData));
                    return;
                }
                this.storageSearchData = this.storageOutTable;
                //搜索
                let list = this.storageSearchData.filter(item => item.docNum.toString().indexOf(this.selectVal) >= 0);
                this.storageSearchData = list;
            },
            reset() {
                this.storageSearchData = JSON.parse(JSON.stringify(this.storageOutTable));
                this.selectVal = null;
            },
            showDialog(row) {
                this.subData = row;
                this.dialogData = row.medicineList;
                this.stateValue = row.docState;
                this.dialogTableVisible = true;
            },
            changeOrder() {
                const documentFormData = this.subData;
                if (this.subData.docState === 2) {
                    this.$message.error("订单已出库,不可修改");
                    return;
                }
                let i = 0;
                for (const item of this.dialogData) {
                    documentFormData.medicineList[i] = item;
                    i = i + 1;
                }
                this.$http({
                    url: '/documenttable/changeDocument',
                    method: 'post',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: documentFormData
                }).then(resp => {

                })
            },
            handleDelete(index, row) {
                const data = {
                    docNum: row.docNum
                }
                this.$http.post('/documenttable/deleteDocument', qs.stringify(data)).then(resp => {
                })
                this.$router.go(0)
            },
            tableRowClassName({row, rowIndex}) {
                if (row.docState == 2) {
                    return 'success-row';
                } else {
                    return 'warning-row';
                }
            },
            addMedicineList() {
                const medicineItem = {
                    medicineNum: '',
                    medicinePrice: '',
                    storageNumber: '',
                    medicineName: '',
                }
                medicineItem.medicineNum = this.medicinenum;
                medicineItem.medicineName = this.medicineName;
                medicineItem.storageNumber = this.medicinenumber;
                medicineItem.medicinePrice = this.medicinePrice;
                this.dialogData[this.dialogData.length] = medicineItem;
                this.dialogData.splice(1, 0);
            },
            insertStorageOut() {
                let user = window.sessionStorage.getItem("userid");
                for (const item of this.rationList) {
                    console.log(item)
                    if (item.departmentNum === this.departmentNum) {
                        const data = {
                            ration: item,
                            user:user
                        }
                        console.log(data);
                        this.$http.post("/documenttable/generateOut", data);
                        this.$router.go(0);
                    }
                }
            },
            completedOut(index, row) {
                if (row.docState === 2) {
                    this.$message.error("订单已出库");
                    return;
                }
                const data = {
                    docnum: row.docNum
                }
                this.$http.post('/documenttable/outDone', qs.stringify(data));
                this.$router.go(0);
            }
        }
    }
</script>

<style scoped>
    .el-table .warning-row {
        background: oldlace;
    }

    .el-table .success-row {
        background: #f0f9eb;
    }
</style>