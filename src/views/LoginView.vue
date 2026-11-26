<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import { setLocale } from '../i18n';
import { useAuthStore } from '../stores/auth';

const { t, locale } = useI18n();
const router = useRouter();
const route = useRoute();
const auth = useAuthStore();

const identifier = ref('');
const password = ref('');
const deviceName = ref(t('auth.webBrowser'));

const submitting = computed(() => auth.status === 'loading');

/** Redirection interne uniquement : jamais d'URL absolue dans le paramètre. */
function destination(): string | { name: 'home' } {
  const redirect = route.query.redirect;
  if (typeof redirect === 'string' && redirect.startsWith('/') && !redirect.startsWith('//')) {
    return redirect;
  }
  return { name: 'home' };
}

async function submit(): Promise<void> {
  const succes = await auth.login(identifier.value.trim(), password.value, deviceName.value.trim());
  if (succes) {
    await router.replace(destination());
  }
}

function changerLangue(event: Event): void {
  const valeur = (event.target as HTMLSelectElement).value;
  setLocale(valeur === 'mg' ? 'mg' : 'fr');
}
</script>

<template>
  <div class="auth-layout">
    <aside class="brand-panel">
      <div class="brand-mark">P&amp;K</div>
      <h1>{{ t('app.name') }}</h1>
      <p>{{ t('app.tagline') }}</p>
      <p class="brand-caption">P&amp;K Fashion and Tech · Antananarivo</p>
    </aside>

    <main class="form-panel">
      <div class="form-card">
        <div class="form-heading">
          <h2>{{ t('auth.loginTitle') }}</h2>
          <p class="muted">{{ t('auth.loginSubtitle') }}</p>
        </div>

        <form class="form" novalidate @submit.prevent="submit">
          <label class="field">
            <span>{{ t('auth.email') }}</span>
            <input
              v-model="identifier"
              type="email"
              name="identifier"
              autocomplete="username"
              :placeholder="t('auth.emailPlaceholder')"
              required
              autofocus
            />
          </label>

          <label class="field">
            <span>{{ t('auth.password') }}</span>
            <input
              v-model="password"
              type="password"
              name="password"
              autocomplete="current-password"
              required
            />
          </label>

          <label class="field">
            <span>{{ t('auth.deviceName') }}</span>
            <input
              v-model="deviceName"
              type="text"
              name="deviceName"
              maxlength="120"
              :placeholder="t('auth.deviceNamePlaceholder')"
            />
          </label>

          <p v-if="auth.errorMessage" class="alert alert-error" role="alert">
            {{ auth.errorMessage }}
          </p>

          <button class="btn btn-primary" type="submit" :disabled="submitting">
            {{ submitting ? t('auth.submitting') : t('auth.submit') }}
          </button>
        </form>

        <div class="form-footer">
          <label class="inline-field">
            <span>{{ t('language.label') }}</span>
            <select :value="locale" @change="changerLangue">
              <option value="fr">{{ t('language.fr') }}</option>
              <option value="mg">{{ t('language.mg') }}</option>
            </select>
          </label>
        </div>
      </div>
    </main>
  </div>
</template>
