<template>
    <div class="container">
        <div class="input-area">
            <textarea v-model="sql"/>
        </div>
        <select v-model="viewMode">
            <option value="text">TEXT</option>
            <option value="table">TABLE</option>
        </select>
        <div class="output-area">
            <div class="item" 
                v-if="viewMode === 'text'"
                v-for="item in results.queries" :key="item.key">
                {{ item }}
            </div>
            <table v-else>
                <thead>
                    <tr>
                        <td>TYPE</td>
                        <td>TABLE_NAME</td>
                        <td>TYPE2</td>
                        <td>TABLE_NAME2</td>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in results.queries" :key="item.key">
                        <td>{{ item.type }}</td>
                        <td>{{ item.tableName }}</td>
                        <td>{{ item.type2 }}</td>
                        <td>{{ item.tableName2 }}</td>
                    </tr>
                </tbody>
            </table>
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
        WHERE C_ID = 'C_ID2';

        SELECT COL_A1, COL_B2, COL_C3
        FROM (
            SELECT A.COL_A1, B.COL_B2, C.COL_C3
            FROM TABLE_A
            INNER JOIN TABLE_B
            ON A.C_ID = B.C_ID
            INNER JOIN TABLE_C
            ON A.C_ID = C.C_ID
        ) A
         WHERE C_ID = 'C_ID3'
    `.trim());

    const results = computed(() => {
        return new OracleSqlParser(sql.value);
    })

    const viewMode = ref<"text" | "table">("text")
</script>
<style>
    .container textarea {
        width: 80vw;
        height: 10em;
    }

    table {
        border-collapse: collapse;
        width: 100%;
    }

    th, td {
        border: 1px solid white;
        padding: 8px;
        text-align: left;
    }
</style>