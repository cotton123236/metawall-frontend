<script setup>
import { ref } from 'vue-demi';

defineProps(['isChecked'])
defineEmits(['update:isChecked'])
</script>

<template>
  <label class="toggle">
    <input type="checkbox"
        :checked="isChecked"
        @change="$emit('update:isChecked', $event.target.checked)"
        />
    <span class="slider"></span>
  </label>
</template>

<style lang="scss">
.toggle {
  --width: 40px;
  --height: calc(var(--width) / 3);

  position: relative;
  display: inline-block;
  width: var(--width);
  height: var(--height);
  box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.3);
  border-radius: var(--height);
  cursor: pointer;
}

.toggle input {
  display: none;
}

.toggle .slider {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: var(--height);
  background-color: #ccc;
  transition: all 0.4s ease-in-out;
}

.toggle .slider::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: calc(var(--height));
  height: calc(var(--height));
  border-radius: calc(var(--height) / 2);
  background-color: #fff;
  box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.3);
  transition: all 0.4s ease-in-out;
}

.toggle input:checked + .slider {
  background-color: #2196f3;
}

.toggle input:checked + .slider::before {
  transform: translateX(calc(var(--width) - var(--height)));
}
</style>
