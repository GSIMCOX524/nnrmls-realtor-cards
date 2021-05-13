<template>
<div id="templateRoot">
  <div id="card-item-object-vertical" class="card-item" :class="{ '-active' : isCardFlipped }">
    <div id="card-front-instance" class="card-item__side -front">
      <div
        class="card-item__focus"
        :class="{'-active' : focusElementStyle }"
        :style="focusElementStyle"
        ref="focusElement"
      ></div>
      <div id="card-cover" class="card-item__cover">
        <img
          v-if="verticalCardBackgroundFront"
          :src="verticalCardBackgroundFront"
          class="card-item__bg"
          id="verticalCardBackgroundFront"
        />
      </div>
      <div class="card-item__wrapper">
        <div class="card-item__top">
          <img
            src="https://raw.githubusercontent.com/GSIMCOX524/nnrmls-realtor-cards/master/src/assets/images/Card-Template-Photo-Placeholder.png"
            id="cardUploadedPhoto"
          />
          <img
            src="https://raw.githubusercontent.com/GSIMCOX524/nnrmls-realtor-cards/master/src/assets/images/REALTOR-R.png"
            class="card-item__chip"
          />
          <div class="card-item__type">
            <transition name="slide-fade-up">
              <img
                :src="'https://raw.githubusercontent.com/muhammederdem/credit-card-form/master/src/assets/images/' + cardType + '.png'"
                v-if="cardType"
                :key="cardType"
                alt
                class="card-item__typeImg"
              />
            </transition>
          </div>
        </div>
        <div class="card-item__content">
          <label :for="fields.cardName" id="nameLabel" class="card-item__info" :ref="fields.cardName">
            <transition name="slide-fade-up">
              <div class="card-item__name" id="customNameHandler" v-if="labels.cardName.length" key="1">
              </div>
              <div class="card-item__name" v-else key="2"><span id="italicFirst">First Name</span>Last Name</div>
            </transition>
          </label>
        </div>
      </div>
    </div>
    <div id="card-back-instance" class="card-item__side -back">
      <div id="card-back-cover" class="card-item__cover">
        <img
          v-if="verticalCardBackgroundBack"
          :src="verticalCardBackgroundBack"
          class="card-item__bg"
          id="verticalCardBackgroundBack"
        />
      </div>
      <div class="layoutLabels">
        <span id="sectionLabel">STATS</span>
      </div>
      <div id="rearContent">
      <div class="card-item__cvv">
        <div class="card-item__cvvTitle">REALTOR® ID Number:</div>
          <transition name="slide-fade-up">
                <span id="realtorID" class="rearDataSpan"></span>
              </transition>
      </div>
      <div class="card-item__cvv">
        <div class="card-item__cvvTitle">Designations/Certifications:</div>
          <transition name="slide-fade-up">
                <span id="designations" class="rearDataSpan"></span>
              </transition>
      </div>
      <div class="card-item__cvv">
        <div class="card-item__cvvTitle">REALTOR® Since:</div>
          <transition name="slide-fade-up">
                <span class="rearDataSpan" v-if="labels.cardYear" :key="labels.cardYear">{{String(labels.cardYear).slice(0,4)}}</span>
                <span class="rearDataSpan"></span>
              </transition>
      </div>
      <div id="expandedArea" class="card-item__cvv">
        <div class="card-item__cvvTitle">Business Background/Testimonials:</div>
          <transition name="slide-fade-up">
                <span id="businessBackground" class="rearDataSpan"></span>
              </transition>
      </div>
      </div>
    </div>
  </div>
  <div id="card-item-object-horizontal" class="card-item" :class="{ '-active' : isCardFlipped }" style="display:none">
    <div id="card-front-instance" class="card-item__side -front">
      <div
        class="card-item__focus"
        :class="{'-active' : focusElementStyle }"
        :style="focusElementStyle"
        ref="focusElement"
      ></div>
      <div id="card-cover" class="card-item__cover">
        <img
          v-if="horizontalCardBackgroundFront"
          :src="horizontalCardBackgroundFront"
          class="card-item__bg"
          id="horizontalCardBackgroundFront"
        />
      </div>
      <div class="card-item__wrapper">
        <div class="card-item__top">
          <img
            src="https://raw.githubusercontent.com/GSIMCOX524/nnrmls-realtor-cards/master/src/assets/images/Card-Template-Photo-Placeholder.png"
            id="cardUploadedPhoto"
          />
          <div class="card-item__type">
            <transition name="slide-fade-up">
              <img
                :src="'https://raw.githubusercontent.com/muhammederdem/credit-card-form/master/src/assets/images/' + cardType + '.png'"
                v-if="cardType"
                :key="cardType"
                alt
                class="card-item__typeImg"
              />
            </transition>
          </div>
        </div>
        <div class="card-item__content">
          <label :for="fields.cardName" id="nameLabel" class="card-item__info" :ref="fields.cardName">
            <transition name="slide-fade-up">
              <div class="card-item__name" id="customNameHandler" v-if="labels.cardName.length" key="1">
              </div>
              <div class="card-item__name" v-else key="2"><span id="italicFirst">First Name</span>Last Name</div>
            </transition>
          </label>
        </div>
      </div>
    </div>
    <div id="card-back-instance" class="card-item__side -back">
      <div id="card-back-cover" class="card-item__cover">
        <img
          v-if="horizontalCardBackgroundBack"
          :src="horizontalCardBackgroundBack"
          class="card-item__bg"
          id="horizontalCardBackgroundBack"
        />
      </div>
      <div class="layoutLabels">
        <span id="sectionLabel">STATS</span>
      </div>
      <div id="rearContent">
      <div class="card-item__cvv">
        <div class="card-item__cvvTitle">REALTOR® ID Number:</div>
          <transition name="slide-fade-up">
                <span id="realtorID" class="rearDataSpan"></span>
              </transition>
      </div>
      <div class="card-item__cvv">
        <div class="card-item__cvvTitle">Designations/Certifications:</div>
          <transition name="slide-fade-up">
                <span id="designations" class="rearDataSpan"></span>
              </transition>
      </div>
      <div class="card-item__cvv">
        <div class="card-item__cvvTitle">REALTOR® Since:</div>
          <transition name="slide-fade-up">
                <span class="rearDataSpan" v-if="labels.cardYear" :key="labels.cardYear">{{String(labels.cardYear).slice(0,4)}}</span>
                <span class="rearDataSpan"></span>
              </transition>
      </div>
      <div id="expandedArea" class="card-item__cvv">
        <div class="card-item__cvvTitle">Business Background/Testimonials:</div>
          <transition name="slide-fade-up">
                <span id="businessBackground" class="rearDataSpan"></span>
              </transition>
      </div>
      </div>
    </div>
  </div>
  </div>
</template>

<script>
export default {
  name: 'Card',
  props: {
    labels: Object,
    fields: Object,
    isCardNumberMasked: Boolean,
    randomBackgrounds: {
      type: Boolean,
      default: true
    },
    backgroundImage: [String, Object]
  },
  data () {
    return {
      focusElementStyle: null,
      currentFocus: null,
      isFocused: false,
      isCardFlipped: false,
      amexCardPlaceholder: '#### ###### #####',
      dinersCardPlaceholder: '#### ###### ####',
      defaultCardPlaceholder: '#### #### #### ####',
      currentPlaceholder: ''
    }
  },
  watch: {
    currentFocus () {
      if (this.currentFocus) {
        this.changeFocus()
      } else {
        this.focusElementStyle = null
      }
    },
    cardType () {
      this.changePlaceholder()
    }
  },
  mounted () {
    this.changePlaceholder()

    let self = this
    let fields = document.querySelectorAll('[data-card-field]')
    fields.forEach(element => {
      element.addEventListener('focus', () => {
        this.isFocused = true
        if (element.id === this.fields.cardYear || element.id === this.fields.cardMonth) {
          this.currentFocus = 'cardDate'
        } else {
          this.currentFocus = element.id
        }
        this.isCardFlipped = (element.id === this.fields.cardCvv) || (element.id === this.fields.cardDesignations) || (element.id === this.fields.cardBusinessBackground) || (element.id === this.fields.cardYear) || (element.id === this.fields.cardRealtorID)
      })
      element.addEventListener('blur', () => {
        this.isCardFlipped = !element.id === this.fields.cardCvv
        setTimeout(() => {
          if (!self.isFocused) {
            self.currentFocus = null
          }
        }, 300)
        self.isFocused = false
      })
    })
  },
  computed: {
    cardType () {
      let number = this.labels.cardNumber
      let re = new RegExp('^4')
      if (number.match(re) != null) return 'visa'

      re = new RegExp('^(34|37)')
      if (number.match(re) != null) return 'amex'

      re = new RegExp('^5[1-5]')
      if (number.match(re) != null) return 'mastercard'

      re = new RegExp('^6011')
      if (number.match(re) != null) return 'discover'

      re = new RegExp('^62')
      if (number.match(re) != null) return 'unionpay'

      re = new RegExp('^9792')
      if (number.match(re) != null) return 'troy'

      re = new RegExp('^3(?:0([0-5]|9)|[689]\\d?)\\d{0,11}')
      if (number.match(re) != null) return 'dinersclub'

      re = new RegExp('^35(2[89]|[3-8])')
      if (number.match(re) != null) return 'jcb'

      return '' // default type
    },
    verticalCardBackgroundFront () {
      return 'https://raw.githubusercontent.com/GSIMCOX524/nnrmls-realtor-cards/master/src/assets/images/Card-Template-Front.png'
    },
    verticalCardBackgroundBack () {
      return 'https://raw.githubusercontent.com/GSIMCOX524/nnrmls-realtor-cards/master/src/assets/images/Card-Template-Back.png'
    },
    horizontalCardBackgroundFront () {
      return 'https://raw.githubusercontent.com/GSIMCOX524/nnrmls-realtor-cards/master/src/assets/images/Horizontal-Card-Template-Front.png'
    },
    horizontalCardBackgroundBack () {
      return 'https://raw.githubusercontent.com/GSIMCOX524/nnrmls-realtor-cards/master/src/assets/images/Horizontal-Card-Template-Front.png'
    }
  },
  methods: {
    changeFocus () {
      let target = this.$refs[this.currentFocus]
      this.focusElementStyle = target ? {
        width: `${target.offsetWidth}px`,
        height: `${target.offsetHeight}px`,
        transform: `translateX(${target.offsetLeft}px) translateY(${target.offsetTop}px)`
      } : null
    },
    getIsNumberMasked (index, n) {
      return index > 4 && index < 14 && this.labels.cardNumber.length > index && n.trim() !== '' && this.isCardNumberMasked
    },
    changePlaceholder () {
      if (this.cardType === 'amex') {
        this.currentPlaceholder = this.amexCardPlaceholder
      } else if (this.cardType === 'dinersclub') {
        this.currentPlaceholder = this.dinersCardPlaceholder
      } else {
        this.currentPlaceholder = this.defaultCardPlaceholder
      }
      this.$nextTick(() => {
        this.changeFocus()
      })
    }
  }
}
</script>
