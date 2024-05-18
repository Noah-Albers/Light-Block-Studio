<template>
  <v-app>
    <v-main>
      <Splitpanes class="default-theme"
        :push-other-panes="false">
        <Pane>
          <TheWorkspace />
        </Pane>
        <Pane>
          <TheSidebar />
        </Pane>
      </Splitpanes>
    </v-main>

    <v-navigation-drawer width="60"
      permanent
      location="right">
      <v-list lines="one"
        density="comfortable">

        <v-list-item rounded="xl"
          v-for="(item, idx) in topItems"
          @click="item.action"
          :key="idx"
          :prepend-icon="item.icon">
          <v-tooltip activator="parent"
            location="left">
            {{ item.title }}
          </v-tooltip>
        </v-list-item>
      </v-list>

      <template v-slot:append>
        <v-list lines="one"
          density="comfortable">
          <v-list-item rounded="xl"
            v-for="(item, idx) in bottomItems"
            @click="item.action"
            :key="idx"
            :prepend-icon="item.icon">
            <v-tooltip activator="parent"
              location="left">
              {{ item.title }}
            </v-tooltip>
          </v-list-item>
        </v-list>
      </template>

    </v-navigation-drawer>
  </v-app>
</template>

<script setup
  lang="ts">

  import { Splitpanes, Pane } from 'splitpanes'
  import 'splitpanes/dist/splitpanes.css'
  import TheWorkspace from "./views/workspace/TheWorkspace.vue";
  import TheSidebar from "./views/sidebar/TheSidebar.vue";

  // Menu items on the top
  const topItems = [
    {
      title: "Settings",
      icon: "mdi-home",
      action: null
    }, {
      title: "Project settings",
      icon: "mdi-account",
      action: null
    }
  ];

  // Menu items on the bottom
  const bottomItems = [
    {
      title: "Copy Code",
      icon: "mdi-code-tags",
      action: null
    }
  ]


</script>

<style lang="scss"></style>
