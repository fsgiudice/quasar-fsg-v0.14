export default {
  props: {
    autofocus: Boolean,
    name: String,
    maxLength: [Number, String],
    maxHeight: Number,
    placeholder: String,
    loading: Boolean,
    autocapitalize: String, // as suggested from https://forum.quasar-framework.org/topic/928/q-input-turn-off-spellcheck-capitalization-autocorrect/4
    autocomplete: String,
    autocorrect: String,
    spellcheck: String
  },
  computed: {
    inputPlaceholder () {
      if ((!this.floatLabel && !this.stackLabel) || this.labelIsAbove) {
        return this.placeholder
      }
    }
  },
  methods: {
    focus () {
      if (!this.disable) {
        this.$refs.input.focus()
      }
    },
    blur () {
      this.$refs.input.blur()
    },
    select () {
      this.$refs.input.select()
    },

    __onFocus (e) {
      this.focused = true
      this.$emit('focus', e)
    },
    __onBlur (e) {
      this.focused = false
      this.$emit('blur', e)
    },
    __onKeydown (e) {
      this.$emit('keydown', e)
    },
    __onKeyup (e) {
      this.$emit('keyup', e)
    },
    __onClick (e) {
      this.focus()
      this.$emit('click', e)
    }
  },
  mounted () {
    this.$nextTick(() => {
      const input = this.$refs.input
      if (this.autofocus && input) {
        input.focus()
      }
    })
  }
}
