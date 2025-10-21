<template>
  <div class="relative">
    <label :for="id" class="form-label">
      {{ label }} <span v-if="required" class="text-red-500">*</span>
    </label>
    <div class="relative">
      <input :id="id" :type="type" :value="modelValue" @input="handleInput" @blur="handleBlur" class="form-input pr-10"
        :class="{
          'border-red-500': error,
          'border-green-500': !error && touched && modelValue,
        }" v-bind="$attrs" />
      <!-- Icône de validation -->
      <div class="absolute right-3 top-1/2 -translate-y-1/2">
        <IconCircleCheck v-if="!error && touched && modelValue" class="w-5 h-5 text-green-500" />
        <IconAlertCircle v-else-if="error" class="w-5 h-5 text-red-500" />
      </div>
    </div>
    <p v-if="error" class="text-red-600 text-sm mt-1">{{ error }}</p>
    <p v-else-if="hint" class="text-gray-500 text-sm mt-1">{{ hint }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { IconCircleCheck, IconAlertCircle } from '@tabler/icons-vue';

const props = defineProps({
  id: String,
  label: String,
  type: { type: String, default: 'text' },
  modelValue: [String, Number],
  error: String,
  hint: String,
  required: Boolean,
  validator: Function,
});

const emit = defineEmits(['update:modelValue', 'update:error']);

const touched = ref(false);

const handleInput = (event) => {
  const value = event.target.value;
  emit('update:modelValue', value);

  if (touched.value && props.validator) {
    const error = props.validator(value);
    emit('update:error', error);
  }
};

const handleBlur = () => {
  touched.value = true;
  if (props.validator) {
    const error = props.validator(props.modelValue);
    emit('update:error', error);
  }
};
</script>
