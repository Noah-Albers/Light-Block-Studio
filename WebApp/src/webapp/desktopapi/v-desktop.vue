<!--
    Component that renders it's slot only when it's run on a desktop environment
    and not inside a browser
-->
<template>
    <template v-if="DesktopApi.isDesktop()">
        <slot></slot>
    </template>
</template>

<script lang="ts" setup>
import DesktopApi from './DesktopApi';
</script>