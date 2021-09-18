<template>
  <div>
    <v-form>
      <!-- MAIN INFO -->
      <v-card class="card" :elevation="2">
        <div class="text-subtitle-2 mb-2">ID пользователя</div>
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
        <div class="text-subtitle-2 mb-2">Просмотреть лайки</div>
        <v-checkbox
          v-model="localFilters.contentTypes.wall"
          label="Постов"
          hide-details
          dense
        ></v-checkbox>
        <v-checkbox
          v-model="localFilters.contentTypes.comments"
          label="Комментариев"
          hide-details
          dense
        ></v-checkbox>
        <v-checkbox
          v-model="localFilters.contentTypes.photos"
          label="Фото в альбомах"
          dense
          hide-details
        ></v-checkbox>
        <div class="v-messages v-messages__message error--text">
          {{ showLikesErrors }}
        </div>
      </v-card>
      <!-- WHERE TO SEARCH -->
      <v-card class="card" :elevation="2">
        <div class="text-subtitle-2 mb-2">Искать на/в</div>
        <div class="card__flex-container">
          <v-checkbox
            v-model="localFilters.whereSearch.userPages"
            label="Страницах"
            hide-details
            dense
          ></v-checkbox>
          <v-checkbox
            v-model="localFilters.whereSearch.groupPages"
            label="Группах"
            hide-details
            dense
          ></v-checkbox>
        </div>
        <div class="mt-2 v-messages v-messages__message error--text">
          {{ searchInErrors }}
        </div>
      </v-card>
      <!-- WHERE TO SEARCH IN USERS -->
      <v-card
        v-if="localFilters.whereSearch.userPages"
        class="card"
        :elevation="2"
      >
        <div class="text-subtitle-2 mb-4">Фильтр пользователей</div>
        <v-select
          label="Искать в:"
          v-model="localFilters.whereSearchInUsers.selected"
          :items="localFilters.whereSearchInUsers.items"
          :error-messages="selectUserFilterErrors"
          outlined
          multiple
          dense
          :hide-details="!selectUserFilterErrors.length"
          @change="
            $v.localFilters.whereSearchInUsers.selected.$touch()
          "
          @blur="$v.localFilters.whereSearchInUsers.selected.$touch()"
        ></v-select>
        <v-combobox
          v-if="isSpecifiedProfilesShown"
          class="mt-3"
          v-model="localFilters.whereSearchInUsers.specifiedProfiles"
          label="ID пользователей"
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
          v-model="localFilters.whereSearchInGroups.selected"
          :items="localFilters.whereSearchInGroups.items"
          multiple
          outlined
          dense
          :error-messages="selectGroupFilterErrors"
          :hide-details="!selectGroupFilterErrors.length"
          @change="
            $v.localFilters.whereSearchInGroups.selected.$touch()
          "
          @blur="
            $v.localFilters.whereSearchInGroups.selected.$touch()
          "
        ></v-select>
        <v-combobox
          v-if="isSpecifiedGroupsShown"
          class="mt-3"
          v-model="localFilters.whereSearchInGroups.specifiedGroups"
          label="ID групп"
          multiple
          outlined
          dense
          clearable
          :hide-details="localFilters.valid"
        ></v-combobox>
      </v-card>
      <v-card class="card" :elevation="2">
        <div class="text-subtitle-2 mb-4">Глубина поиска</div>
        <v-select
          label="Выберите глубину:"
          v-model="localFilters.searchDepth.selected"
          :items="localFilters.searchDepth.items"
          outlined
          dense
          hide-details
        ></v-select>
      </v-card>
    </v-form>
  </div>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { mapMutations } from 'vuex'
import { required, maxLength, email } from 'vuelidate/lib/validators'
import validationsMixin from './validationsMixin'
import {
  USER_SERACH_PLACES,
  GROUP_SERACH_PLACES,
} from '../../../../constants/constants'
export default {
  name: 'UserSettingsPanel',
  props: {
    value: Object,
  },
  mixins: [validationMixin, validationsMixin],
  validations: {
    localFilters: {
      userId: { required },
      whereSearchInUsers: {
        selected: {
          some: (val) => val.length,
        },
      },
      whereSearchInGroups: {
        selected: {
          some: (val) => val.length,
        },
      },
    },
  },
  data() {
    return {
      localFilters: {
        ...this.$store.state.settingsFilter.settingsFilters,
      },
    }
  },
  methods:{
    ...mapMutations('settingsFilter', ['setSettingsFilters'])
  },
  computed: {
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
        this.setSettingsFilters({
          ...this.localFilters,
          valid: this.localFilters.valid && !this.$v.$invalid,
        })
      },
      deep: true,
    },
    'localFilters.whereSearch.userPages'() {
      this.localFilters.whereSearchInUsers.selected = [
        USER_SERACH_PLACES.FRIENDS,
      ]
    },
    'localFilters.whereSearch.groupPages'() {
      this.localFilters.whereSearchInGroups.selected = [
        GROUP_SERACH_PLACES.USER_GROUPS,
      ]
    },
  },
  mounted() {
    console.log(this.$store)
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
