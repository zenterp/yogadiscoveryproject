class CreateYogaStudioLeads < ActiveRecord::Migration
  def change
    create_table :yoga_studio_leads do |t|
      t.string :name
      t.string :location
      t.string :website

      t.timestamps
    end
  end
end
