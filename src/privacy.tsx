import { mount } from './boot'
import { LegalPage } from './pages/LegalPage'
import html from './content/legal/privacy.html?raw'

mount(<LegalPage html={html} />)
