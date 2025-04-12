<template>
    <div class="container">
        <div class="input-area">
            <textarea v-model="sql"/>
        </div>
        <div class="output-area">
            <div class="item" v-for="item in results.queries" :key="item.key">
                {{ item }}
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
    import { computed, ref } from 'vue';
import { OracleSqlParser } from '../actions/oracle_sql_parser';

    const sql = ref(`
        SELECT COL_A1, COL_A2, COL_A3
        INTO V_COL_A1, V_COL_A2, V_COL_A3
        FROM TABLE_A
        WHERE COL_A1 = 'VALUE';

        INSERT INTO TABLE_B(COL_B1, COL_B2, COL_B3)
        SELECT COL_A1, COL_A2, COL_A3
        FROM TABLE_A
        WHERE COL_A1 = 'VALUE';

        UPDATE TABLE_C
        SET COL_C1 = 'C1_VALUE',
            COL_C2 = 'C2_VALUE',
            COL_C3 = 'C3_VALUE'
        WHERE C_ID = 'C_ID';

        SELECT COL_A1, COL_B2
        FROM TABLE_A A, TABLE_B B
        WHERE A.COL_A1 = B.COL_B1;

        DELETE FROM TABLE_C
        WHERE C_ID = 'C_ID2'
    `.trim());

    const results = computed(() => {
        return new OracleSqlParser(sql.value);
    })
</script>
<style>
    .container textarea {
        width: 80vw;
        height: 10em;
    }
</style>