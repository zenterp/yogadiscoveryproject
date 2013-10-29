Yogadiscoveryproject::Application.routes.draw do
  get 'auth/facebook/callback', to: 'facebook/sessions#create'
  
  root to: 'application#index'
  get '*path', to: redirect('/')
end
