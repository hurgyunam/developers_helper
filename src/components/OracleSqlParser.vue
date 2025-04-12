<template>
    <div class="container">
        <textarea v-model="sql"/>
    </div>
</template>
<script lang="ts" setup>
    import { ref } from 'vue';

    const sql = ref('');
</script>
<style scoped>
    .container text-area {
        width: 80vw;
    }
</style>