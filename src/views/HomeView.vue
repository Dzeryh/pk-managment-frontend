<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { setLocale } from '../i18n';
import { useAuthStore } from '../stores/auth';

const { t, locale } = useI18n();
const router = useRouter();
const auth = useAuthStore();

const currentPassword = ref('');
const newPassword = ref('');
const confirmPassword = ref('');
const saving = ref(false);
const passwordError = ref<string | null>(null);
const passwordSuccess = ref(false);

const roleLabel = computed(() => (auth.user === null ? '' : t(`roles.${auth.user.role}`)));

async function submitPassword(): Promise<void> {
  passwordError.value = null;
  passwordSuccess.value = false;

  if (newPassword.value !== confirmPassword.value) {
    passwordError.value = t('auth.passwordsMismatch');
    return;
  }

  saving.value = true;
  const succes = await auth.changePassword(currentPassword.value, newPassword.value);
  saving.value = false;

  if (!succes) {
    passwordError.value = auth.errorMessage;
    return;
  }

  passwordSuccess.value = true;
  currentPassword.value = '';
  newPassword.value = '';
  confirmPassword.value = '';
}

async function seDeconnecter(): Promise<void> {
  await auth.logout();
  await router.replace({ name: 'login' });
}

function changerLangue(event: Event): void {
  const valeur = (event.target as HTMLSelectElement).value;
  setLocale(valeur === 'mg' ? 'mg' : 'fr');
}
</script>

<template>
  <div class="page">
    <header class="topbar">
      <div class="brand-small">
        <span class="brand-mark-small">P&amp;K</span>
        <span>{{ t('app.name') }}</span>
      </div>

      <div class="topbar-actions">
        <select class="select-compact" :value="locale" :aria-label="t('language.label')" @change="changerLangue">
          <option value="fr">{{ t('language.fr') }}</option>
          <option value="mg">{{ t('language.mg') }}</option>
        </select>
        <button class="btn btn-ghost" type="button" @click="seDeconnecter">
          {{ t('auth.logout') }}
        </button>
      </div>
    </header>

    <main class="container">
      <section class="card">
        <p class="eyebrow">{{ t('home.title') }}</p>
        <h1>{{ t('home.welcome') }}, {{ auth.displayName }}</h1>
        <p class="muted">{{ t('home.sprintNote') }}</p>

        <dl class="details">
          <div>
            <dt>{{ t('home.email') }}</dt>
            <dd>{{ auth.user?.email }}</dd>
          </div>
          <div>
            <dt>{{ t('home.role') }}</dt>
            <dd>{{ roleLabel }}</dd>
          </div>
        </dl>
      </section>

      <section class="card">
        <h2>{{ t('auth.changePassword') }}</h2>
        <p class="muted">{{ t('auth.passwordHint') }}</p>

        <form class="form" novalidate @submit.prevent="submitPassword">
          <label class="field">
            <span>{{ t('auth.currentPassword') }}</span>
            <input
              v-model="currentPassword"
              type="password"
              autocomplete="current-password"
              required
            />
          </label>

          <label class="field">
            <span>{{ t('auth.newPassword') }}</span>
            <input v-model="newPassword" type="password" autocomplete="new-password" required />
          </label>

          <label class="field">
            <span>{{ t('auth.confirmPassword') }}</span>
            <input v-model="confirmPassword" type="password" autocomplete="new-password" required />
          </label>

          <p v-if="passwordError" class="alert alert-error" role="alert">{{ passwordError }}</p>
          <p v-if="passwordSuccess" class="alert alert-success" role="status">
            {{ t('auth.passwordChanged') }}
          </p>

          <button class="btn btn-primary" type="submit" :disabled="saving">
            {{ saving ? t('common.loading') : t('auth.changePasswordSubmit') }}
          </button>
        </form>
      </section>
    </main>
  </div>
</template>
