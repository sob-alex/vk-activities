<template>
  <div>
    <v-form>
      <v-expansion-panels
        v-model="expPanelsControl"
        multiple
        accordion
      >
        <!-- MAIN INFO -->
        <v-expansion-panel>
          <v-expansion-panel-header
            disable-icon-rotate
            class="text-subtitle-2"
          >
            <span
              >Идентификатор пользователя
              <v-tooltip right max-width="300px">
                <template v-slot:activator="{ on, attrs }">
                  <v-icon
                    @click="log"
                    class="ml-1"
                    v-bind="attrs"
                    v-on="on"
                    small
                  >
                    mdi-account-question
                  </v-icon>
                </template>
                <span
                  >Например: 12345, id12345,
                  https://vk.com/id12345</span
                >
              </v-tooltip>
            </span>

            <template v-slot:actions>
              <v-icon color="secondary">mdi-identifier </v-icon>
            </template></v-expansion-panel-header
          >
          <v-expansion-panel-content>
            <v-text-field
              v-model.trim="localFilters.userId"
              label="Введите идентификатор"
              :error-messages="userIdErrors"
              clearable
              dense
              outlined
              :hide-details="!userIdErrors.length"
              @input="$v.localFilters.userId.$touch()"
              @blur="$v.localFilters.userId.$touch()"
            ></v-text-field>
          </v-expansion-panel-content>
        </v-expansion-panel>
        <!-- TYPES OF LIKE CONTENT -->
        <v-expansion-panel @change="log">
          <v-expansion-panel-header
            disable-icon-rotate
            class="text-subtitle-2"
            >Просмотреть лайки
            <template v-slot:actions>
              <v-icon color="secondary">mdi-heart </v-icon>
            </template>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
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
            <div
              v-if="showLikesErrors"
              class="v-messages v-messages__message error--text"
            >
              {{ showLikesErrors }}
            </div>
          </v-expansion-panel-content>
        </v-expansion-panel>
        <!-- WHERE TO SEARCH -->
        <v-expansion-panel>
          <v-expansion-panel-header
            disable-icon-rotate
            class="text-subtitle-2"
            >Искать на/в
            <template v-slot:actions>
              <v-icon color="secondary">mdi-magnify </v-icon>
            </template></v-expansion-panel-header
          >
          <v-expansion-panel-content>
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
            <div
              v-if="searchInErrors"
              class="mt-2 v-messages v-messages__message error--text"
            >
              {{ searchInErrors }}
            </div>
          </v-expansion-panel-content>
        </v-expansion-panel>
        <!-- WHERE TO SEARCH IN USERS -->
        <v-expansion-panel v-if="localFilters.whereSearch.userPages">
          <v-expansion-panel-header
            disable-icon-rotate
            class="text-subtitle-2"
            >Фильтр пользователей
            <template v-slot:actions>
              <v-icon color="secondary">mdi-account </v-icon>
            </template></v-expansion-panel-header
          >
          <v-expansion-panel-content>
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
              @blur="
                $v.localFilters.whereSearchInUsers.selected.$touch()
              "
            ></v-select>
            <v-combobox
              v-if="isSpecifiedProfilesShown"
              class="mt-3"
              v-model="
                localFilters.whereSearchInUsers.specifiedProfiles
              "
              label="ID пользователей"
              multiple
              outlined
              dense
              clearable
              hide-details
            ></v-combobox>
          </v-expansion-panel-content>
        </v-expansion-panel>
        <!-- WHERE TO SEARCH IN GROUPS -->
        <v-expansion-panel v-if="localFilters.whereSearch.groupPages">
          <v-expansion-panel-header
            disable-icon-rotate
            class="text-subtitle-2"
            >Фильтр групп
            <template v-slot:actions>
              <v-icon color="secondary">mdi-account-group </v-icon>
            </template></v-expansion-panel-header
          >
          <v-expansion-panel-content>
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
              v-model="
                localFilters.whereSearchInGroups.specifiedGroups
              "
              label="ID групп"
              multiple
              outlined
              dense
              clearable
              :hide-details="localFilters.valid"
            ></v-combobox>
          </v-expansion-panel-content>
        </v-expansion-panel>
        <v-expansion-panel>
          <v-expansion-panel-header class="text-subtitle-2"
            >Глубина поиска</v-expansion-panel-header
          >
          <v-expansion-panel-content>
            <v-select
              label="Выберите глубину:"
              v-model="localFilters.searchDepth.selected"
              :items="localFilters.searchDepth.items"
              outlined
              dense
              hide-details
            ></v-select>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
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
      userId: {
        required,
        correct: (value) =>
          /^\d+$/.test(value) ||
          /id\d+$/.test(value) ||
          /https:\/\/vk.com\//.test(value),
      },
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
      expPanelsControl: [0],
    }
  },
  methods: {
    ...mapMutations('settingsFilter', ['setSettingsFilters']),
    log(e) {
      e.stopPropagation()
    },
    updateFilters() {
      this.setSettingsFilters({
        ...JSON.parse(JSON.stringify(this.localFilters)),
        valid: this.localFilters.valid && !this.$v.$invalid,
      })
    },
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
      handler: 'updateFilters',
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
.v-expansion-panel-content::v-deep {
  .v-expansion-panel-content__wrap {
    padding: 0 14px 14px;
  }
}
</style>
