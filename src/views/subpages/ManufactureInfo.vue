<template>
    <div>
        <div style="display: inline;align-items: center">
            <el-input v-model="input"
                      style="float: left;width: 67%"
                      placeholder="添加制造商信息"
            >
            </el-input>
            <el-button
                    style="float: left;margin-left: 50px"
                    type="primary" icon="el-icon-edit" @click="insertManufacture"
                    circle></el-button>
        </div>
        <div>
            <el-table :data="manufactureTable">
                <el-table-column
                        prop="manufacturenum"
                        label="制造商编号">
                </el-table-column>
                <el-table-column
                        prop="manufacturername"
                        label="制造商">
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
        </div>
    </div>
</template>

<script>
    export default {
        name: "ManufactureInfo",
        data() {
            return {
                manufactureTable: [],
                input: '',
            }
        },
        mounted: function () {
            this.checkId()
            this.loadManufacture()
        },
        methods: {
            loadManufacture() {
                this.$http.get('/manufacturetable/manufactureInfo').then(response => {
                    this.manufactureTable = response
                })
            },
            handleEdit(index, row) {
                this.$prompt('请输入新的制造商信息', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                }).then(({value}) => {
                    this.$http({
                        url: '/manufacturetable/changeManufactureInfo',
                        method: 'post',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        data: {
                            manufacturenum: row.manufacturenum,
                            manufacturername: value
                        }
                    }).then(resp => {
                        const data = {
                            manufacturenum: index + 1,
                            manufacturername: value,
                        }
                        this.manufactureTable[index] = data;
                        this.manufactureTable.splice(1, 0);
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '取消输入'
                    });
                });
            },
            handleDelete(index, row) {
                this.$http({
                    url: '/manufacturetable/deleteManufactureInfo',
                    method: 'post',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    params: {
                        manufacturenum: row.manufacturenum
                    }
                }).then(resp => {
                    if (resp.status === 200) {
                        this.$message.success(resp.data);
                    } else {
                        this.$message.error(resp.data);
                    }
                });
                this.$router.go(0);
            },
            checkId() {
                var uid = window.sessionStorage.getItem("userIdentity");
                if (uid != 1 && uid != 2 && uid != 3) {
                    this.$router.replace("/home");
                    this.$message.error("权限不足");
                }
            },
            insertManufacture() {
                if (this.input) {
                    this.$http({
                        url: '/manufacturetable/insertManufactureInfo',
                        method: 'post',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        params: {
                            manufacturename: this.input
                        }
                    }).then(res => {
                        if (res.status === 200) {
                            this.$message.success(res.data);
                        } else {
                            this.$message.error(res.data);
                        }
                    })
                } else {
                    this.$message.error("输入不能为空");
                }
                this.$router.go(0);
            }
        }
    }


</script>

<style scoped>

</style>