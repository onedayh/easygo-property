<template>
    <div id="calendar3">
        <div class="c-header">
            <span class="c-prev" @click="year--">
                <svg width="20" height="20" viewBox="0 0 16 16" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                    <g class="transform-group">
                        <g transform="scale(0.015625, 0.015625)">
                            <path d="M671.968 912c-12.288 0-24.576-4.672-33.952-14.048L286.048 545.984c-18.752-18.72-18.752-49.12 0-67.872l351.968-352c18.752-18.752 49.12-18.752 67.872 0 18.752 18.72 18.752 49.12 0 67.872l-318.016 318.048 318.016 318.016c18.752 18.752 18.752 49.12 0 67.872C696.544 907.328 684.256 912 671.968 912z" fill="#5e7a88"></path>
                        </g>
                    </g>
                </svg>
            </span>
            <p class="year">{{year}}</p>
            <span class="c-next" @click="year++">
                <svg width="20" height="20" viewBox="0 0 16 16" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                    <g class="transform-group">
                        <g transform="scale(0.015625, 0.015625)">
                            <path d="M761.056 532.128c0.512-0.992 1.344-1.824 1.792-2.848 8.8-18.304 5.92-40.704-9.664-55.424L399.936 139.744c-19.264-18.208-49.632-17.344-67.872 1.888-18.208 19.264-17.376 49.632 1.888 67.872l316.96 299.84-315.712 304.288c-19.072 18.4-19.648 48.768-1.248 67.872 9.408 9.792 21.984 14.688 34.56 14.688 12 0 24-4.48 33.312-13.44l350.048-337.376c0.672-0.672 0.928-1.6 1.6-2.304 0.512-0.48 1.056-0.832 1.568-1.344C757.76 538.88 759.2 535.392 761.056 532.128z" fill="#5e7a88"></path>
                        </g>
                    </g>
                </svg>
            </span>
        </div>
        <div class="c-body">
            <ul>
                <li v-for="(m, i) in monthData" :key="i">
                    <span @click="select" :data-value="year + '-' + m.value" :class="{'active':value == year + '-' + m.value }">{{m.name}}</span>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    import util from '../util/util'
    import bus from '../assets/js/bus'

    export default {
        data(){
            return{
                value: '',      //日历的值
                year: '',       //日历年份
                monthData: [
                    { name: '一月', value: '01' },
                    { name: '二月', value: '02' },
                    { name: '三月', value: '03' },
                    { name: '四月', value: '04' },
                    { name: '五月', value: '05' },
                    { name: '六月', value: '06' },
                    { name: '七月', value: '07' },
                    { name: '八月', value: '08' },
                    { name: '九月', value: '09' },
                    { name: '十月', value: '10' },
                    { name: '十一月', value: '11' },
                    { name: '十二月', value: '12' }
                ]
            }
        },
        created(){
            this.getNowYearMonth()
        },
        activated(){
            if(!this.$route.meta.isBack) this.getNowYearMonth()
        },
        methods: {
            //初始化年月
            getNowYearMonth(){
                let date = new Date();
                let _self = this;
                _self.year = date.getFullYear();
                let month = date.getMonth() + 1;
                _self.value = _self.year + '-' + util.addZero(month);
                bus.$emit('init', _self.value)
            },
            //选择年月
            select(e){
                let _self = this;
                let v = e.target.dataset.value;
                _self.value = v;
                bus.$emit('select', _self.value)
            }
        }
    }
</script>

