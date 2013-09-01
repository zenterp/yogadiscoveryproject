class YogaClassesController < ApplicationController
  def show
    @data = {
      yoga_studio_id: params[:studio_id],
      yoga_studio_name: 'Urban Flow Yoga',
      yoga_class_name: 'Level 2-3',
      url: request.original_url
    }
  end
end