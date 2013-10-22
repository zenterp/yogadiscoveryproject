require 'open-uri'
require 'nokogiri'

class YogaToThePeopleScraper
  attr_reader :document

  def initialize(url)
    @document = Nokogiri::HTML(open(url))
  end

  def parse_classes
    yoga_classes = []
    mon_through_thurs = @document.xpath("//p[(((count(preceding-sibling::*) + 1) = 4) and parent::*)]").text
    fri = @document.xpath("//p[(((count(preceding-sibling::*) + 1) = 6) and parent::*)]").text
    sat = @document.xpath("//p[(((count(preceding-sibling::*) + 1) = 8) and parent::*)]").text
    sun = @document.xpath("//p[(((count(preceding-sibling::*) + 1) = 10) and parent::*)]").text

    %w(monday tuesday wednesday thursday).each do |day|
      mon_through_thurs.split(", ").each do |time|
        yoga_classes.push({
          day: day,
          start_time: time,
          duration: 60
        })
      end 
    end

    fri.split(", ").each do |time|
      yoga_classes.push({
        day: 'friday',
        start_time: time,
        duration: 60
      })
    end 

    sat.split(", ").each do |time|
      yoga_classes.push({
        day: 'saturday',
        start_time: time,
        duration: 60
      })
    end 

    sun.split(", ").each do |time|
      yoga_classes.push({
        day: 'sunday',
        start_time: time,
        duration: 60
      })
    end 

    return yoga_classes
  end
end
#scraper = YogaToThePeopleScraper.new('http://yogatothepeople.com/san-francisco/schedule-fees/')
#scraper = YogaToThePeopleScraper.new('http://yogatothepeople.com/berkeley/vinyasa/schedule-fees/')
#scraper = YogaToThePeopleScraper.new('http://yogatothepeople.com/berkeley/berkeley-hot-yoga/schedule-fees/')