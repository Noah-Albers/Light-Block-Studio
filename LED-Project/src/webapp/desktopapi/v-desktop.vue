<!--
    Component that renders it's slot only when it's run on a desktop environment
    and not inside a browser
-->
<template>
    <template v-if="isDesktop()">
        <slot></slot>
    </template>
</template>

<script lang="ts" setup>
import { isDesktop } from './DesktopApi';
</script>