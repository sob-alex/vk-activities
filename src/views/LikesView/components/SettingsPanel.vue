<template>
  <div>
    <v-form>
      <!-- MAIN INFO -->
      <v-card class="card" :elevation="2">
        <div class="text-subtitle-2 mb-2">
          ID пользователя
        </div>
        <v-text-field
          v-model="localFilters.userId"
          label="Введите ID"
          :error-messages="userIdErrors"
          clearable
          dense
          outlined
          :hide-details="!userIdErrors.length"
          @input="$v.localFilters.userId.$touch()"
          @blur="$v.localFilters.userId.$touch()"
        ></v-text-field>
      </v-card>
      <!-- TYPES OF LIKE CONTENT -->
      <v-card class="card" :elevation="2">
        <div class="text-subtitle-2 mb-2">
          Просмотреть лайки
        </div>
        <v-checkbox
          v-model="localFilters.contentTypes.wall"
          label="Постов"
          hide-details
          :error-messages="showLikesErrors"
          dense
        ></v-checkbox>
        <v-checkbox
          v-model="localFilters.contentTypes.comments"
          label="Комментариев"
          hide-details
          :error-messages="showLikesErrors"
          dense
        ></v-checkbox>
        <v-checkbox
          v-model="localFilters.contentTypes.photos"
          label="Фото в альбомах"
          dense
          :error-messages="showLikesErrors"
        ></v-checkbox>
      </v-card>
      <!-- WHERE TO SEARCH -->
      <v-card class="card" :elevation="2">
        <div class="text-subtitle-2 mb-2">Искать на/в</div>
        <div class="card__flex-container">
          <v-checkbox
            v-model="localFilters.whereSearch.userPages"
            label="Страницах"
            hide-details
            :error-messages="searchInErrors"
            dense
          ></v-checkbox>
          <!-- TODO: bad desicion, need to put error in some div -->
          <v-checkbox
            v-model="localFilters.whereSearch.groupPages"
            label="Группах"
            :error-messages="searchInErrors"
            dense
          ></v-checkbox>
        </div>
      </v-card>
      <!-- WHERE TO SEARCH IN USERS -->
      <v-card
        v-if="localFilters.whereSearch.userPages"
        class="card"
        :elevation="2"
      >
        <div class="text-subtitle-2 mb-4">
          Фильтр пользователей
        </div>
        <v-select
          label="Искать в:"
          v-model="localFilters.whereSearchInUsers.selected"
          :items="localFilters.whereSearchInUsers.items"
          :rules="[rules.required]"
          outlined
          multiple
          dense
          hide-details
        ></v-select>
        <v-combobox
          v-if="isSpecifiedProfilesShown"
          class="mt-3"
          v-model="
            localFilters.whereSearchInUsers
              .specifiedProfiles
          "
          label="ID пользователей"
          :rules="[rules.required]"
          multiple
          outlined
          dense
          clearable
          hide-details
        ></v-combobox>
      </v-card>
      <!-- WHERE TO SEARCH IN GROUPS -->
      <v-card
        v-if="localFilters.whereSearch.groupPages"
        class="card"
        :elevation="2"
      >
        <div class="text-subtitle-2 mb-4">Фильтр групп</div>
        <v-select
          label="Искать в:"
          v-model="
            localFilters.whereSearchInGroups.selected
          "
          :items="localFilters.whereSearchInGroups.items"
          :rules="[rules.required]"
          multiple
          outlined
          dense
          hide-details
        ></v-select>
        <v-combobox
          v-if="isSpecifiedGroupsShown"
          class="mt-3"
          v-model="
            localFilters.whereSearchInUsers.specifiedGroups
          "
          :rules="[rules.required]"
          label="ID групп"
          multiple
          outlined
          dense
          clearable
          :hide-details="valid"
        ></v-combobox>
      </v-card>
    </v-form>
  </div>
</template>

<script>
import { validationMixin } from 'vuelidate'
import {
  required,
  maxLength,
  email,
} from 'vuelidate/lib/validators'
import { isSomeValueTrueInObject } from '../../../utils/utils'
import {
  USER_SERACH_PLACES,
  GROUP_SERACH_PLACES,
} from '../../../constants/constants'
export default {
  name: 'UserSettingsPanel',
  props: {
    value: Object,
  },
  mixins: [validationMixin],
  validations: {
    localFilters: {
      userId: { required },
    },
  },
  data() {
    return {
      valid: true,
      localFilters: { ...this.value },
      rules: {
        required: (value) =>
          Boolean(value.length) || 'Выберите что-нибудь',
      },
    }
  },
  computed: {
    userIdErrors() {
      const errors = []
      if (!this.$v.localFilters.userId.$dirty) return errors
      if (!this.$v.localFilters.userId.required) {
        errors.push('User ID не должно быть пустым')
      }
      return errors
    },
    showLikesErrors() {
      this.valid = true

      if (
        !isSomeValueTrueInObject(
          this.localFilters.contentTypes
        )
      ) {
        this.valid = false
        return 'Выберите хотя бы одну опцию'
      }
      return ''
    },
    searchInErrors() {
      this.valid = true
      if (
        !isSomeValueTrueInObject(
          this.localFilters.whereSearch
        )
      ) {  
        this.valid = false
        return 'Выберите хотя бы одну опцию'
      }
      return ''
    },
    isSpecifiedProfilesShown() {
      return this.localFilters.whereSearchInUsers.selected.includes(
        USER_SERACH_PLACES.SPECIFIED_PROFILES
      )
    },
    isSpecifiedGroupsShown() {
      return this.localFilters.whereSearchInGroups.selected.includes(
        GROUP_SERACH_PLACES.SPECIFIED_GROUPS
      )
    },
  },
  watch: {
    localFilters: {
      handler() {
        this.$emit('input', this.localFilters)
      },
      deep: true,
    },
  },
}
</script>

<style lang="scss" scoped>
.card {
  padding: 12px 12px 15px;
  margin-bottom: 14px;
  &__flex-container {
    display: flex;
    .v-input:first-child {
      margin-right: 10px;
    }
  }
}
</style>
