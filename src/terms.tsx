import { mount } from './boot'
import { LegalPage } from './pages/LegalPage'
import html from './content/legal/terms.html?raw'

mount(<LegalPage html={html} />)
