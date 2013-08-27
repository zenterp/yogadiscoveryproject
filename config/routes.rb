Yogadiscoveryproject::Application.routes.draw do
  devise_for :users

  namespace :api do 
    resources :studios, only: [:create]
  end 

  get 'studios/new' => 'studios#new'
  get 'studios-near/:location', to: 'studios#search'
  get 'studios-near/:location/:id', to: 'studios#show'
  get 'studios/search', to: 'studios#search'

  get '/', to: redirect('/studios-near/san-francisco-ca')
end