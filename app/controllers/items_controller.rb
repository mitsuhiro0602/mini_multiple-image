class ItemsController < ApplicationController
    def new
        @item = Item.new
        @item.images.build
    end

    def create
        @item = Item.create(item_params)
    end

    private
    def item_params
        params.require(:item).permit(:name, :price, images_attributes: [:src])
    end
end
