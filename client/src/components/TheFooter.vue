<template>
  <footer class="app-footer">
    <p>&copy; 2025 Alvásnapló - Minden jog fenntartva.</p>
    <p class="dev">Fejlesztette: <b><a href="https://github.com/mlev25">mlev25</a></b> </p>
  </footer>
</template>

<script setup>
// Nincs szükség scriptre, egyszerű statikus komponens
</script>

<style scoped>
.app-footer {
  text-align: center;
  padding: 5px;
  background-color: #334d6e; /* Ugyanaz a szín, mint a header */
  color: #c4d2e5;
  position: fixed; /* Rögzítés az oldal aljára */
  bottom: 0;
  width: 100%;
  font-size: 0.85em;
  box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.05);
}
.app-footer p {
  margin: 5px 0;
}

.dev a {
  color: #f5df60;
  text-decoration: none;
}
.dev a:hover {
  color: aqua;
}
</style>
