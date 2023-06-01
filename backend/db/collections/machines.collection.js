const collectionName = path.basename(__filename, '.collection.js')
module.exports = function (dbModel) {
	let schema = mongoose.Schema(
		{
			name: { type: String, required: true, unique: true },
			description: { type: String, default: '' },
			picture: { type: String, default: '' },
			location: {
				x: { type: Number, default: 0 },
				y: { type: Number, default: 0 },
			},
			params: [{
        name:{type:String,default:'', index:true},
        min:{type:Number, default:0},
        max:{type:Number, default:100},
        maxDiffValuePerCycle:{type:Number, default:3},
        isRandomData:{type:Boolean, default:true},
        randomDataPeriod:{type:Number,default:1000, min:100, max:86400},
        value:{type:Number, default:50},
      }],
			status: {
				type: String,
				default: 'off',
				enum: ['off', 'on', 'running', 'stoped', 'error'],
				index: true,
			},
			passive: { type: Boolean, default: false, index: true },
			createdDate: { type: Date, default: Date.now, index: true },
			modifiedDate: { type: Date, default: Date.now, index: true },
		},
		{ versionKey: false }
	)

	schema.pre('save', (next) => next())
	schema.pre('remove', (next) => next())
	schema.pre('remove', true, (next, done) => next())
	schema.on('init', (model) => {})
	schema.plugin(mongoosePaginate)

	let model = dbModel.conn.model(collectionName, schema, collectionName)

	model.removeOne = (member, filter) =>
		sendToTrash(dbModel, collectionName, member, filter)
	return model
}
