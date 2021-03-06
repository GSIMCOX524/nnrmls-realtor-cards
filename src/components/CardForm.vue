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
        <button @click="switchToVertical" type="text" class="card-layout__options__button">Vertical</button> | <button @click="switchToHorizontal" type="text" class="card-layout__options__button">Horizontal</button>
        <br><br>
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
        <label :for="fields.photoUpload" id="photoUploadCustomTrigger" class="card-input__input">Choose Photo</label>
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
          spellcheck="false"
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
                v-for="(n, $index) in 75"
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
              :id="fields.cardRealtorID"
              @input="changeRealtorID"
              data-card-field
              autocomplete="off"
            />
          </div>
        </div>
      </div>
      <div class="card-input">
        <label for="cardName" class="card-input__label">{{ $t('cardForm.designations') }}</label>
        <input
          type="text"
          :id="fields.cardDesignations"
          @input="changeDesignations"
          class="card-input__input"
          data-card-field
          autocomplete="off"
          spellcheck="false"
        />
      </div>
      <div class="card-input">
        <label for="cardName" class="card-input__label">{{ $t('cardForm.businessBackground') }}</label>
        <input
          type="text"
          :id="fields.cardBusinessBackground"
          @input="changeBusinessBackground"
          class="card-input__input"
          data-card-field
          autocomplete="off"
          spellcheck="false"
        />
      </div>

      <button id="downloadAsPNGBtn" class="card-form__button" @click="downloadCardAsPNG">{{ $t('cardForm.downloadPNG') }}</button>
      <button id="purchaseBtn" class="card-form__button purchase__button" disabled v-on:click="invaildCard">{{ $t('cardForm.purchasePhysical') }}</button>
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
          cardDesignations: '',
          cardBusinessBackground: '',
          cardRealtorID: '',
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
        cardDesignations: 'v-card-designations',
        cardBusinessBackground: 'v-card-business-background',
        cardRealtorID: 'v-card-realtor-id',
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
      var verticalLayout = document.getElementById('card-item-object-vertical')
      var horizontalLayout = document.getElementById('card-item-object-horizontal')
      verticalLayout.style.display = 'none'
      horizontalLayout.style.display = 'block'
      var horizontalCardBackgroundFront = document.getElementById('horizontalCardBackgroundFront')
      horizontalCardBackgroundFront.src = 'https://raw.githubusercontent.com/GSIMCOX524/nnrmls-realtor-cards/master/src/assets/images/Horizontal-Card-Template-Front.png'
      var horizontalCardBackgroundBack = document.getElementById('horizontalCardBackgroundBack')
      horizontalCardBackgroundBack.src = 'https://raw.githubusercontent.com/GSIMCOX524/nnrmls-realtor-cards/master/src/assets/images/Horizontal-Card-Template-Back.png'
    },
    switchToVertical () {
      var verticalLayout = document.getElementById('card-item-object-vertical')
      var horizontalLayout = document.getElementById('card-item-object-horizontal')
      verticalLayout.style.display = 'block'
      horizontalLayout.style.display = 'none'
      var verticalCardBackgroundFront = document.getElementById('verticalCardBackgroundFront')
      verticalCardBackgroundFront.src = 'https://raw.githubusercontent.com/GSIMCOX524/nnrmls-realtor-cards/master/src/assets/images/Card-Template-Front.png'
      var verticalCardBackgroundBack = document.getElementById('verticalCardBackgroundBack')
      verticalCardBackgroundBack.src = 'https://raw.githubusercontent.com/GSIMCOX524/nnrmls-realtor-cards/master/src/assets/images/Card-Template-Back.png'
    },
    updateFileLabel () {
      var photoUploadCustomTrigger = document.getElementById('photoUploadCustomTrigger')
      var photoUploadLabel = document.getElementById('photoUploadLabel')
      var photoUploadInput = document.getElementById('v-photo-upload')
      var uploadedFileName = photoUploadInput.files[0].name
      var uploadedFileObject = photoUploadInput.files[0]
      var photoArea = document.getElementById('cardUploadedPhoto')
      photoUploadCustomTrigger.innerHTML = 'Change Photo'
      photoUploadLabel.innerHTML = 'Upload a Photo&nbsp;&nbsp;–&nbsp;<span style=color:#13b451;font-weight:600>&nbsp;'.concat(uploadedFileName).concat('&nbsp;&nbsp;&#10004;</span>')
      photoArea.src = window.URL.createObjectURL(uploadedFileObject)
    },
    downloadCardAsPNG () {
      var nameOnCard = document.getElementById('v-card-name').value
      var frontFileName = 'blob'
      var backFileName = 'blob'
      if (nameOnCard) {
        frontFileName = nameOnCard.concat(' – Realtor Team Card (FRONT).png')
        backFileName = nameOnCard.concat(' – Realtor Team Card (BACK).png')
      } else {
        frontFileName = 'Realtor Team Card (FRONT).png'
        backFileName = 'Realtor Team Card (BACK).png'
      }
      var downloadAsPNGBtn = document.getElementById('downloadAsPNGBtn')
      downloadAsPNGBtn.innerHTML = 'Downloading...'
      domtoimage.toBlob(document.getElementById('card-front-instance'), { width: 375, height: 525 })
        .then(function (blob) {
          saveAs(blob, frontFileName)
          console.log('Front of card downloaded as PNG')
        })
      domtoimage.toBlob(document.getElementById('card-back-instance'), { width: 375, height: 525 })
        .then(function (blob) {
          saveAs(blob, backFileName)
          console.log('Back of card downloaded as PNG')
        })
      setTimeout(function () {
        downloadAsPNGBtn.innerHTML = 'Download as PNG'
      }, 2000)
    },
    toProperCase (string) {
      return string.replace(/\w\S*/g, function (text) {
        return text.charAt(0).toUpperCase() + text.substr(1).toLowerCase()
      })
    },
    spliceName (string) {
      let spaceIndex = string.indexOf(' ')
      return spaceIndex === -1 ? string : '<span id=italicFirst>'.concat(string.substr(0, spaceIndex)).concat('</span>').concat(string.substr(spaceIndex + 1))
    },
    changeName (e) {
      this.formData.cardName = this.toProperCase(e.target.value)
      this.$emit('input-card-name', this.toProperCase(this.formData.cardName))
      var customNameDisplay = document.getElementById('customNameHandler')
      customNameDisplay.innerHTML = this.spliceName(this.formData.cardName)
    },
    changeDesignations (e) {
      this.formData.cardDesignations = e.target.value
      this.$emit('input-card-designations', this.formData.cardDesignations)
      var designationsOutput = document.getElementById('designations')
      designationsOutput.innerHTML = this.formData.cardDesignations
    },
    changeBusinessBackground (e) {
      this.formData.cardBusinessBackground = e.target.value
      this.$emit('input-card-business-background', this.formData.cardBusinessBackground)
      var businessBackgroundOutput = document.getElementById('businessBackground')
      businessBackgroundOutput.innerHTML = this.formData.cardBusinessBackground
    },
    changeRealtorID (e) {
      this.formData.cardRealtorID = e.target.value
      this.$emit('input-card-realtor-id', this.formData.cardRealtorID)
      var realtorIDOutput = document.getElementById('realtorID')
      realtorIDOutput.innerHTML = this.formData.cardRealtorID
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
      var verticalCardItemObject = document.getElementById('card-item-object-vertical')
      if (verticalCardItemObject.classList.contains('-active')) {
        verticalCardItemObject.classList.remove('-active')
      } else {
        verticalCardItemObject.classList.add('-active')
      }
      var horizontalCardItemObject = document.getElementById('card-item-object-horizontal')
      if (horizontalCardItemObject.classList.contains('-active')) {
        horizontalCardItemObject.classList.remove('-active')
      } else {
        horizontalCardItemObject.classList.add('-active')
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
