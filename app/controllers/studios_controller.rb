class StudiosController < ApplicationController
  before_filter :authenticate_user!, only: [:new]

  def nearby
  end
end
