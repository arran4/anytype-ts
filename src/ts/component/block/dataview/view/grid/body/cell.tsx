import * as React from 'react';
import { I, DataUtil, Relation } from 'Lib';
import { Cell } from 'Component';
import { dbStore } from 'Store';
import { observer } from 'mobx-react';

interface Props {
	rootId: string;
	block?: I.Block;
	relationKey: string;
	index: number;
	readonly: boolean;
	width: number;
	className?: string;
	getRecord(index: number): any;
	onRef?(ref: any, id: string): void;
	onCellClick?(e: any, key: string, index: number): void;
	onCellChange?(id: string, key: string, value: any, callBack?: (message: any) => void): void;
};

const Constant = require('json/constant.json');

const BodyCell = observer(class BodyCell extends React.Component<Props, {}> {

	render () {
		const { rootId, block, className, relationKey, index, readonly, onRef, onCellClick, onCellChange } = this.props;
		const relation: any = dbStore.getRelation(rootId, block.id, relationKey) || {};
		const cn = [ 'cell', DataUtil.relationClass(relation.format), (!readonly ? 'canEdit' : '') ];
		const idPrefix = 'dataviewCell';
		const id = Relation.cellId(idPrefix, relation.relationKey, index);
		const width = Relation.width(this.props.width, relation.format);
		const size = Constant.size.dataview.cell;
		const subId = dbStore.getSubId(rootId, block.id);

		if (relation.relationKey == Constant.relationKey.name) {
			cn.push('isName');
		};

		if (width <= size.icon) {
			cn.push('small');
		};

		if (className) {
			cn.push(className);
		};

		return (
			<div 
				key={id} 
				id={id} 
				className={cn.join(' ')} 
				onClick={(e: any) => { onCellClick(e, relation.relationKey, index); }} 
			>
				<Cell 
					ref={(ref: any) => { onRef(ref, id); }} 
					{...this.props}
					subId={subId}
					relationKey={relation.relationKey}
					viewType={I.ViewType.Grid}
					idPrefix={idPrefix}
					onCellChange={onCellChange}
					maxWidth={Constant.size.dataview.cell.edit}
				/>
			</div>
		);
	};

});

export default BodyCell;