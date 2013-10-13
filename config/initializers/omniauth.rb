Rails.application.config.middleware.use OmniAuth::Builder do
  provider :developer unless Rails.env.production?
  provider :facebook, ENV['YDP_FACEBOOK_APP_ID'], ENV['YDP_FACEBOOK_APP_SECRET']
end
