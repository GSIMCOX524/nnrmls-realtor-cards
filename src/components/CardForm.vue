<template>
  <div class="card-form">
    <div class="card-list">
      <Card
        :fields="fields"
        :labels="formData"
        :isCardNumberMasked="isCardNumberMasked"
        :randomBackgrounds="randomBackgrounds"
        :backgroundImage="backgroundImage"
      />
    </div>
    <div class="card-form__inner">
      <div class="card-input card-layout__options">
        <button @click="flipCard" type="text" class="card-layout__options__button">Flip</button>
      </div>
        <div class="card-input">
        <label id="photoUploadLabel" class="card-input__label">{{ $t('cardForm.photoUpload') }}</label>
        <input
          type="file"
          :id="fields.photoUpload"
          class="card-input__input"
          hidden
          @change="updateFileLabel"
        />
        <label :for="fields.photoUpload" id="photoUploadCustomTrigger" class="card-input__input">Choose File</label>
      </div>
      <div class="card-input">
        <label for="cardNumber" class="card-input__label">{{ $t('cardForm.cardNumber') }}</label>
        <input
          type="tel"
          :id="fields.cardNumber"
          @input="changeNumber"
          @focus="focusCardNumber"
          @blur="blurCardNumber"
          class="card-input__input"
          :value="formData.cardNumber"
          :maxlength="cardNumberMaxLength"
          data-card-field
          autocomplete="off"
        />
        <button
          class="card-input__eye"
          :class="{ '-active' : !isCardNumberMasked }"
          title="Show/Hide card number"
          tabindex="-1"
          :disabled="formData.cardNumber === ''"
          @click="toggleMask"
        ></button>
      </div>
      <div class="card-input">
        <label for="cardName" class="card-input__label">{{ $t('cardForm.cardName') }}</label>
        <input
          type="text"
          :id="fields.cardName"
          v-letter-only
          @input="changeName"
          class="card-input__input"
          :value="formData.cardName"
          data-card-field
          autocomplete="off"
        />
      </div>
      <div class="card-form__row">
        <div class="card-form__col">
          <div class="card-form__group">
            <label for="cardMonth" class="card-input__label">{{ $t('cardForm.expirationDate') }}</label>
            <select
              class="card-input__input -select"
              :id="fields.cardYear"
              v-model="formData.cardYear"
              @change="changeYear"
              data-card-field
            >
              <option value disabled selected>{{ $t('cardForm.year') }}</option>
              <option
                v-bind:value="minCardYear - $index"
                v-for="(n, $index) in 50"
                v-bind:key="n"
              >{{minCardYear - $index}}</option>
            </select>
          </div>
        </div>
        <div class="card-form__col -cvv">
          <div class="card-input">
            <label for="cardCvv" class="card-input__label">{{ $t('cardForm.CVV') }}</label>
            <input
              type="tel"
              class="card-input__input"
              v-number-only
              :id="fields.cardCvv"
              maxlength="4"
              :value="formData.cardCvv"
              @input="changeCvv"
              data-card-field
              autocomplete="off"
            />
          </div>
        </div>
      </div>

      <button id="downloadAsPNGBtn" class="card-form__button" @click="downloadCardAsPNG">{{ $t('cardForm.downloadPNG') }}</button>
      <button class="card-form__button purchase__button" v-on:click="invaildCard">{{ $t('cardForm.purchasePhysical') }}</button>
    </div>
  </div>
</template>

<script>
import Card from '@/components/Card'
import domtoimage from 'dom-to-image'
import { saveAs } from 'file-saver'
export default {
  name: 'CardForm',
  directives: {
    'number-only': {
      bind (el) {
        function checkValue (event) {
          event.target.value = event.target.value.replace(/[^0-9]/g, '')
          if (event.charCode >= 48 && event.charCode <= 57) {
            return true
          }
          event.preventDefault()
        }
        el.addEventListener('keypress', checkValue)
      }
    },
    'letter-only': {
      bind (el) {
        function checkValue (event) {
          if (event.charCode >= 48 && event.charCode <= 57) {
            event.preventDefault()
          }
          return true
        }
        el.addEventListener('keypress', checkValue)
      }
    }
  },
  props: {
    formData: {
      type: Object,
      default: () => {
        return {
          cardName: '',
          cardNumber: '',
          cardNumberNotMask: '',
          cardMonth: '',
          cardYear: '',
          cardCvv: ''
        }
      }
    },
    backgroundImage: [String, Object],
    randomBackgrounds: {
      type: Boolean,
      default: true
    }
  },
  components: {
    Card
  },
  data () {
    return {
      fields: {
        photoUpload: 'v-photo-upload',
        cardNumber: 'v-card-number',
        cardName: 'v-card-name',
        cardMonth: 'v-card-month',
        cardYear: 'v-card-year',
        cardCvv: 'v-card-cvv'
      },
      minCardYear: new Date().getFullYear(),
      isCardNumberMasked: true,
      mainCardNumber: this.cardNumber,
      cardNumberMaxLength: 19
    }
  },
  computed: {
    minCardMonth () {
      if (this.formData.cardYear === this.minCardYear) return new Date().getMonth() + 1
      return 1
    }
  },
  watch: {
    cardYear () {
      if (this.formData.cardMonth < this.minCardMonth) {
        this.formData.cardMonth = ''
      }
    }
  },
  mounted () {
    this.maskCardNumber()
  },
  methods: {
    generateMonthValue (n) {
      return n < 10 ? `0${n}` : n
    },
    switchToHorizontal () {
      var originalCardItem = document.getElementById('card-item-object')
      originalCardItem.style.height = '318px'
      originalCardItem.style.maxWidth = '445px'
    },
    switchToVertical () {
      var originalCardItem = document.getElementById('card-item-object')
      originalCardItem.style.height = '445px'
      originalCardItem.style.maxWidth = '318px'
    },
    updateFileLabel () {
      var photoUploadCustomTrigger = document.getElementById('photoUploadCustomTrigger')
      var photoUploadLabel = document.getElementById('photoUploadLabel')
      var photoUploadInput = document.getElementById('v-photo-upload')
      var uploadedFileName = photoUploadInput.files[0].name
      var uploadedFileObject = photoUploadInput.files[0]
      var cardCover = document.getElementById('card-cover')
      photoUploadCustomTrigger.innerHTML = 'Change File'
      photoUploadLabel.innerHTML = 'Upload a Photo <span style=color:#13b451;font-weight:600>('.concat(uploadedFileName).concat(')</span>')
      cardCover.style.backgroundImage = 'url('.concat(window.URL.createObjectURL(uploadedFileObject)).concat(')')
    },
    downloadCardAsPNG () {
      var nameOnCard = document.getElementById('v-card-name').value
      var downloadAsPNGBtn = document.getElementById('downloadAsPNGBtn')
      downloadAsPNGBtn.innerHTML = 'Downloading...'
      domtoimage.toBlob(document.getElementById('card-front-instance'))
        .then(function (blob) {
          saveAs(blob, ''.concat(nameOnCard).concat(' – Realtor Team Card.png'))
        })
      setTimeout(function () {
        downloadAsPNGBtn.innerHTML = 'Download as PNG'
      }, 2000)
    },
    changeName (e) {
      this.formData.cardName = e.target.value
      this.$emit('input-card-name', this.formData.cardName)
    },
    changeNumber (e) {
      this.formData.cardNumber = e.target.value
      let value = this.formData.cardNumber.replace(/\D/g, '')
      // american express, 15 digits
      if ((/^3[47]\d{0,13}$/).test(value)) {
        this.formData.cardNumber = value.replace(/(\d{4})/, '$1 ').replace(/(\d{4}) (\d{6})/, '$1 $2 ')
        this.cardNumberMaxLength = 17
      } else if ((/^3(?:0[0-5]|[68]\d)\d{0,11}$/).test(value)) { // diner's club, 14 digits
        this.formData.cardNumber = value.replace(/(\d{4})/, '$1 ').replace(/(\d{4}) (\d{6})/, '$1 $2 ')
        this.cardNumberMaxLength = 16
      } else if ((/^\d{0,16}$/).test(value)) { // regular cc number, 16 digits
        this.formData.cardNumber = value.replace(/(\d{4})/, '$1 ').replace(/(\d{4}) (\d{4})/, '$1 $2 ').replace(/(\d{4}) (\d{4}) (\d{4})/, '$1 $2 $3 ')
        this.cardNumberMaxLength = 19
      }
      // eslint-disable-next-line eqeqeq
      if (e.inputType == 'deleteContentBackward') {
        let lastChar = this.formData.cardNumber.substring(this.formData.cardNumber.length, this.formData.cardNumber.length - 1)
        // eslint-disable-next-line eqeqeq
        if (lastChar == ' ') { this.formData.cardNumber = this.formData.cardNumber.substring(0, this.formData.cardNumber.length - 1) }
      }
      this.$emit('input-card-number', this.formData.cardNumber)
    },
    changeMonth () {
      this.$emit('input-card-month', this.formData.cardMonth)
    },
    changeYear () {
      this.$emit('input-card-year', this.formData.cardYear)
    },
    changeCvv (e) {
      this.formData.cardCvv = e.target.value
      this.$emit('input-card-cvv', this.formData.cardCvv)
    },
    flipCard () {
      var cardItemObject = document.getElementById('card-item-object')
      if (cardItemObject.classList.contains('-active')) {
        cardItemObject.classList.remove('-active')
      } else {
        cardItemObject.classList.add('-active')
      }
    },
    invaildCard () {
      let number = this.formData.cardNumberNotMask.replace(/ /g, '')
      var sum = 0
      for (var i = 0; i < number.length; i++) {
        var intVal = parseInt(number.substr(i, 1))
        if (i % 2 === 0) {
          intVal *= 2
          if (intVal > 9) {
            intVal = 1 + (intVal % 10)
          }
        }
        sum += intVal
      }
      if (sum % 10 !== 0) {
        alert(this.$t('cardForm.invalidCardNumber'))
      }
    },
    blurCardNumber () {
      if (this.isCardNumberMasked) {
        this.maskCardNumber()
      }
    },
    maskCardNumber () {
      this.formData.cardNumberNotMask = this.formData.cardNumber
      this.mainCardNumber = this.formData.cardNumber
      let arr = this.formData.cardNumber.split('')
      arr.forEach((element, index) => {
        if (index > 4 && index < 14 && element.trim() !== '') {
          arr[index] = '*'
        }
      })
      this.formData.cardNumber = arr.join('')
    },
    unMaskCardNumber () {
      this.formData.cardNumber = this.mainCardNumber
    },
    focusCardNumber () {
      this.unMaskCardNumber()
    },
    toggleMask () {
      this.isCardNumberMasked = !this.isCardNumberMasked
      if (this.isCardNumberMasked) {
        this.maskCardNumber()
      } else {
        this.unMaskCardNumber()
      }
    }
  }
}
</script>
